/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { businessCustomerSearchableFields } from './businessCustomer.constant';
import { IBusinessCustomer, IBusinessFilters } from './businessCustomer.interface';
import { BusinessCustomer } from './businessCustomer.model';

const getAllBusinessCustomers = async (
  filters: IBusinessFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBusinessCustomer[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: businessCustomerSearchableFields.map(field => ({
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

  const result = await BusinessCustomer.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await BusinessCustomer.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBusinessCustomer = async (id: string): Promise<IBusinessCustomer | null> => {
  const result = await BusinessCustomer.findById(id)

  return result;
};

const updateBusinessCustomer = async (
  id: string,
  payload: Partial<IBusinessCustomer>
): Promise<IBusinessCustomer | null> => {
  const isExist = await BusinessCustomer.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BusinessCustomer not found !');
  }

  const { companyName, ...businessCustomerData } = payload;

  const updatedBusinessCustomerData: Partial<IBusinessCustomer> = { ...businessCustomerData };

  if (companyName && Object.keys(companyName).length > 0) {
    Object.keys(companyName).forEach(key => {
      const companyNameKey = `companyName.${key}` as keyof Partial<IBusinessCustomer>; // `companyName.fisrtName`
      (updatedBusinessCustomerData as any)[companyNameKey] = companyName[key as keyof typeof companyName];
    });
  }

  const result = await BusinessCustomer.findByIdAndUpdate(id, updatedBusinessCustomerData, {
    new: true,
  });

  return result;
};

const deleteBusinessCustomer = async (id: string): Promise<IBusinessCustomer | null> => {
  // check if the businessCustomer is exist
  const isExist = await BusinessCustomer.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BusinessCustomer not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete businessCustomer first
    const businessCustomer = await BusinessCustomer.findByIdAndDelete(id, { session });
    if (!businessCustomer) {
      throw new ApiError(404, 'Failed to delete businessCustomer');
    }
    //delete user
    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return businessCustomer;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const BusinessCustomerService = {
  getAllBusinessCustomers,
  getSingleBusinessCustomer,
  updateBusinessCustomer,
  deleteBusinessCustomer,
};
