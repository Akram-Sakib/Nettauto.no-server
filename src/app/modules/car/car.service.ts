import { SortOrder, Types } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { CarSearchableFields } from './car.constants';
import {
  ICar,
  ICarFilters,
  IDocuments,
} from './car.interfaces';
import { Car } from './car.model';

const createCar = async (carData: ICar) => {

  const car = new Car(carData);
  return await car.save();
}

const getSingleCar = async (
  id: string
): Promise<ICar | null> => {
  const result = await Car.findById(id)

  return result;
};

const getAllCars = async (
  filters: ICarFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICar[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: CarSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $paginationOptions: 'i',
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

  // If there is no condition , put {} to give all data
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Car.find(whereConditions)
    // .populate('car')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Car.countDocuments(whereConditions);

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
  id: string, data: Partial<ICar>, images?: Express.Multer.File[]
): Promise<ICar | null> => {
  const car = await Car.findById(id);
  if (!car) throw new Error('Car not found');

  if (images) {
    const imageUrls = images.map((image) => image.path);
    car.images.push(...imageUrls);
  }
  Object.assign(car, data);

  return car.save();
  // const result = await Car.findOneAndUpdate(
  //   { _id: id },
  //   payload,
  //   {
  //     new: true,
  //   }
  // );

  // return result;
};

// async updateCar(id: string, data: Partial<ICar>, images ?: Express.Multer.File[]) {
//   const car = await CarModel.findById(id);
//   if (!car) throw new Error('Car not found');

//   if (images) {
//     const imageUrls = images.map((image) => image.path);
//     car.images.push(...imageUrls);
//   }

//   Object.assign(car, data);
//   return car.save();
// }

const deleteCar = async (
  id: string
): Promise<ICar | null> => {
  const result = await Car.findByIdAndDelete(id);
  return result;
};



export const CarService = {
  createCar,
  getSingleCar,
  getAllCars,
  updateCar,
  deleteCar,
};
