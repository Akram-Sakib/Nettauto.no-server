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
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { PrivateCustomer } from '../privateCustomer/privateCustomer.model';
import { BusinessCustomer } from '../businessCustomer/businessCustomer.model';
import { Auction } from '../auction/auction.model';


const createBid = async (userId: string, bidData: IBid): Promise<IBid> => {
  // Find the user in either PrivateCustomer or BusinessCustomer
  const privateCustomer = await PrivateCustomer.findOne({ userId });
  const businessCustomer = await BusinessCustomer.findOne({ userId });
  const activeCustomer = privateCustomer || businessCustomer;

  if (!activeCustomer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is active as a buyer
  if (activeCustomer.activeAs !== 'buyer') {
    throw new ApiError(httpStatus.FORBIDDEN, 'User is not active as a buyer');
  }

  // Check if the auction exists
  const auction = await Auction.findById(bidData.auction).populate('sellerDetails');
  if (!auction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Auction not found');
  }

  // Check if the user is trying to bid on their own auction
  // @ts-ignore
  const isOwnAuction = String(auction.sellerDetails._id) === String(activeCustomer._id);
  if (isOwnAuction) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot bid on your own auction');
  }

  // Find the highest current bidNumber in the database for incremental numbering
  const lastBid = await Bid.findOne().sort({ bidNumber: -1 }).exec();
  let newBidNumber = lastBid ? lastBid.bidNumber + 1 : 1;

  // Assign the new bid number to the bid and the buyer's ID
  bidData.bidNumber = newBidNumber;
  bidData.buyer = activeCustomer._id;

  // Create and save the new bid
  const newBid = await Bid.create(bidData);

  return newBid;
};

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
