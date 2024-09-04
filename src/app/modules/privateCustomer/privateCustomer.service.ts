/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllPrivateCustomersisable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { privateCustomerSearchableFields } from './privateCustomer.constant';
import { IPrivateCustomer, IPrivateCustomerFilters } from './privateCustomer.interface';
import { PrivateCustomer } from './privateCustomer.model';

const getSinglePrivateCustomer = async (id: string): Promise<IPrivateCustomer | null> => {
  const result = await PrivateCustomer.findOne({ id })
    // .populate('Auction')
    // .populate('PrivateCustomer');

  return result;
};

const getAllPrivateCustomers = async (
  filters: IPrivateCustomerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPrivateCustomer[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: privateCustomerSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await PrivateCustomer.find(whereConditions)
    // .populate('Auction')
    // .populate('PrivateCustomer')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await PrivateCustomer.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updatePrivateCustomer = async (
  id: string,
  payload: Partial<IPrivateCustomer>
): Promise<IPrivateCustomer | null> => {
  const isExist = await PrivateCustomer.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PrivateCustomer not found !');
  }

  const { name, ...PrivateCustomerData } = payload;
  const updatedPrivateCustomerData: Partial<IPrivateCustomer> = { ...PrivateCustomerData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IPrivateCustomer>;
      (updatedPrivateCustomerData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await PrivateCustomer.findOneAndUpdate({ id }, updatedPrivateCustomerData,
    { new: true }
  )
    // .populate('PrivateCustomer')
    // .populate('Auction')
    ;

  return result;
};

const deletePrivateCustomer = async (id: string): Promise<IPrivateCustomer | null> => {
  // check if the faculty is exist
  const isExist = await PrivateCustomer.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PrivateCustomer not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete faculty first
    const faculty = await PrivateCustomer.findOneAndDelete({ id }, { session });
    if (!faculty) {
      throw new ApiError(404, 'Failed to delete student');
    }
    //delete user
    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return faculty;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const PrivateCustomerService = {
  getSinglePrivateCustomer,
  getAllPrivateCustomers,
  updatePrivateCustomer,
  deletePrivateCustomer,
};
