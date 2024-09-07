import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { BidSearchableFields } from './bid.constants';
import {
  IBid,
  IBidFilters
} from './bid.interfaces';
import { Bid } from './bid.model';

const createBid = async (BidData: IBid) => {

  const result = new Bid(BidData);
  return await result.save();
}

const getSingleBid = async (
  id: string
): Promise<IBid | null> => {
  const result = await Bid.findById(id)

  return result;
};

const getAllBids = async (
  filters: IBidFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBid[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: BidSearchableFields.map(field => ({
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

  const result = await Bid.find(whereConditions)
    // .populate('Bid')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Bid.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateBid = async (
  id: string, data: Partial<IBid>, images?: Express.Multer.File[]
): Promise<IBid | null> => {
  const result = await Bid.findById(id);
  if (!result) throw new Error('Bid not found');

  Object.assign(result, data);

  return result.save();
  // const result = await Bid.findOneAndUpdate(
  //   { _id: id },
  //   payload,
  //   {
  //     new: true,
  //   }
  // );

  // return result;
};

// async updateBid(id: string, data: Partial<IBid>, images ?: Express.Multer.File[]) {
//   const Bid = await BidModel.findById(id);
//   if (!Bid) throw new Error('Bid not found');

//   if (images) {
//     const imageUrls = images.map((image) => image.path);
//     Bid.images.push(...imageUrls);
//   }

//   Object.assign(Bid, data);
//   return Bid.save();
// }

const deleteBid = async (
  id: string
): Promise<IBid | null> => {
  const result = await Bid.findByIdAndDelete(id);
  return result;
};



export const BidService = {
  createBid,
  getSingleBid,
  getAllBids,
  updateBid,
  deleteBid,
};
