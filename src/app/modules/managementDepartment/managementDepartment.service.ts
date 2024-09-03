import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { managementCarSearchableFields } from './managementCar.constant';
import {
  IManagementCar,
  IManagementCarFilters,
} from './managementCar.inerface';
import { ManagementCar } from './managementCar.model';

const createCar = async (
  payload: IManagementCar
): Promise<IManagementCar | null> => {
  const result = await ManagementCar.create(payload);
  return result;
};

const getSingleCar = async (
  id: string
): Promise<IManagementCar | null> => {
  const result = await ManagementCar.findById(id);
  return result;
};

const getAllCars = async (
  filters: IManagementCarFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IManagementCar[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: managementCarSearchableFields.map(field => ({
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

  const result = await ManagementCar.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await ManagementCar.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateCar = async (
  id: string,
  payload: Partial<IManagementCar>
): Promise<IManagementCar | null> => {
  const result = await ManagementCar.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  );
  return result;
};

const deleteCar = async (
  id: string
): Promise<IManagementCar | null> => {
  console.log(id)
  const result = await ManagementCar.findByIdAndDelete(id);
  return result;
};

export const ManagementCarService = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
};
