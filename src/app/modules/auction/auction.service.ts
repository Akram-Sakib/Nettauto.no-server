import { SortOrder, Types } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { AuctionSearchableFields } from './auction.constants';
import {
  IAuction,
  IAuctionFilters,
  IDocuments,
} from './auction.interfaces';
import { Auction } from './auction.model';

const createAuction = async (auctionData: IAuction) => {

  const auction = new Auction(auctionData);
  return await auction.save();
}

const getSingleAuction = async (
  id: string
): Promise<IAuction | null> => {
  const result = await Auction.findById(id)

  return result;
};

const getAllAuctions = async (
  filters: IAuctionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAuction[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: AuctionSearchableFields.map(field => ({
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

  const result = await Auction.find(whereConditions)
    // .populate('auction')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Auction.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateAuction = async (
  id: string, data: Partial<IAuction>, images?: Express.Multer.File[]
): Promise<IAuction | null> => {
  const auction = await Auction.findById(id);
  if (!auction) throw new Error('Auction not found');

  if (images) {
    const imageUrls = images.map((image) => image.path);
    auction.images.push(...imageUrls);
  }
  Object.assign(auction, data);

  return auction.save();
  // const result = await Auction.findOneAndUpdate(
  //   { _id: id },
  //   payload,
  //   {
  //     new: true,
  //   }
  // );

  // return result;
};

// async updateAuction(id: string, data: Partial<IAuction>, images ?: Express.Multer.File[]) {
//   const auction = await AuctionModel.findById(id);
//   if (!auction) throw new Error('Auction not found');

//   if (images) {
//     const imageUrls = images.map((image) => image.path);
//     auction.images.push(...imageUrls);
//   }

//   Object.assign(auction, data);
//   return auction.save();
// }

const deleteAuction = async (
  id: string
): Promise<IAuction | null> => {
  const result = await Auction.findByIdAndDelete(id);
  return result;
};



export const AuctionService = {
  createAuction,
  getSingleAuction,
  getAllAuctions,
  updateAuction,
  deleteAuction,
};
