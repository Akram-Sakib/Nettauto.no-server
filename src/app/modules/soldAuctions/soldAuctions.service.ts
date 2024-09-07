import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { SoldAuctionSearchableFields } from './soldAuctions.constants';
import {
  ISoldAuction,
  ISoldAuctionFilters
} from './soldAuctions.interfaces';
import { SoldAuction } from './soldAuctions.model';

const createSoldAuction = async (soldAuctionData: ISoldAuction) => {

  const soldAuction = new SoldAuction(soldAuctionData);
  return await soldAuction.save();
}

const getSingleSoldAuction = async (
  id: string
): Promise<ISoldAuction | null> => {
  const result = await SoldAuction.findById(id)

  return result;
};

const getAllSoldAuctions = async (
  filters: ISoldAuctionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ISoldAuction[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: SoldAuctionSearchableFields.map(field => ({
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

  const result = await SoldAuction.find(whereConditions)
    // .populate('soldAuction')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await SoldAuction.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateSoldAuction = async (
  id: string, data: Partial<ISoldAuction>, images?: Express.Multer.File[]
): Promise<ISoldAuction | null> => {
  const soldAuction = await SoldAuction.findById(id);
  if (!soldAuction) throw new Error('SoldAuction not found');

  Object.assign(soldAuction, data);

  return soldAuction.save();
  // const result = await SoldAuction.findOneAndUpdate(
  //   { _id: id },
  //   payload,
  //   {
  //     new: true,
  //   }
  // );

  // return result;
};

// async updateSoldAuction(id: string, data: Partial<ISoldAuction>, images ?: Express.Multer.File[]) {
//   const soldAuction = await SoldAuctionModel.findById(id);
//   if (!soldAuction) throw new Error('SoldAuction not found');

//   if (images) {
//     const imageUrls = images.map((image) => image.path);
//     soldAuction.images.push(...imageUrls);
//   }

//   Object.assign(soldAuction, data);
//   return soldAuction.save();
// }

const deleteSoldAuction = async (
  id: string
): Promise<ISoldAuction | null> => {
  const result = await SoldAuction.findByIdAndDelete(id);
  return result;
};



export const SoldAuctionService = {
  createSoldAuction,
  getSingleSoldAuction,
  getAllSoldAuctions,
  updateSoldAuction,
  deleteSoldAuction,
};
