import { FilterQuery, SortOrder, Types } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { AuctionFilterableFields, AuctionSearchableFields } from './auction.constants';
import {
  IAuction,
  IAuctionFilters,
  IAuctionStatus
} from './auction.interfaces';
import { Auction } from './auction.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { AuctionValidation } from './auction.validations';
import { PrivateCustomer } from '../privateCustomer/privateCustomer.model';
import { BusinessCustomer } from '../businessCustomer/businessCustomer.model';

const createAuction = async (data: IAuction, files: any,
  userId: Types.ObjectId): Promise<IAuction> => {

  const { carDetails, auctionDetails, buyerDetails } = data

  if (!files) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "File isn't Upload Properly",
    );
  }

  // @ts-ignore
  carDetails.images = files.images.map((file) => file.path);
  // @ts-ignore
  carDetails.documents = files.pdfs.map((file) => ({ originalname: file.originalname, path: file.path }));


  const auctionData = {
    sellerDetails: userId,
    carDetails: {
      ...carDetails,
    },
    auctionDetails,
    buyerDetails,
  };

  await AuctionValidation.createAuctionZodSchema.parseAsync(auctionData);


  auctionData.auctionDetails.status = IAuctionStatus.AWAITING_APPROVAL
  const auction = await Auction.create(auctionData);

  const result = await auction.populate({
    path: "sellerDetails",
    populate: [
      { path: 'businessCustomer', model: 'BusinessCustomer' },
      { path: 'privateCustomer', model: 'PrivateCustomer' }
    ]
  });

  return result
}

const getSingleAuction = async (
  id: string
): Promise<IAuction | null> => {
  const result = await Auction.findById(id).populate({
    path: "sellerDetails",
    populate: [
      { path: 'businessCustomer', model: 'BusinessCustomer' },
      { path: 'privateCustomer', model: 'PrivateCustomer' }
    ]
  })

  return result;
};

const getAllAuctions = async (
  filters: IAuctionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAuction[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterFields } = filters;
  const andConditions: FilterQuery<IAuction>[] = [];

  // If searchTerm is provided, search in AuctionSearchableFields
  if (searchTerm) {
    andConditions.push({
      $or: AuctionSearchableFields.map(field => (
        field === "_id" ? {
          _id: Types.ObjectId.isValid(searchTerm) ? new Types.ObjectId(searchTerm) : null, //
        } : {
          [field]: {
            $regex: searchTerm,
            $options: 'i', // case-insensitive search
          },
        }
      )),
    });
  }

  // Apply filters for auction status and other AuctionFilterableFields
  Object.keys(filterFields).forEach(key => {
    if (AuctionFilterableFields.includes(key) && (filterFields as any)[key]) {
      if (key === 'auctionDetails.minimumPrice') {
        andConditions.push({
          'auctionDetails.minimumPrice': { $gte: (filterFields as any)[key] },
        });
      } else if (key === 'auctionDetails.startTime' || key === 'auctionDetails.endTime') {
        const timeFilter = key === 'auctionDetails.startTime'
          ? { $gte: new Date((filterFields as any)[key]) }
          : { $lte: new Date((filterFields as any)[key]) };

        andConditions.push({
          [key]: timeFilter,
        });
      } else {
        andConditions.push({
          [key]: (filterFields as any)[key],
        });
      }
    }
  });

  const queryConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  // console.log(JSON.stringify(queryConditions, null, 2));


  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Retrieve auctions with the applied filters and pagination
  const auctions = await Auction.find(queryConditions)
    .populate('sellerDetails')
    .populate('auctionDetails') // Adjust as needed
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .exec();

  const total = await Auction.countDocuments(queryConditions);

  return {
    data: auctions,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const updateAuction = async (
  auctionId: string,
  auctionData: Partial<IAuction>,
  files: any,
  userId: Types.ObjectId
): Promise<IAuction | null> => {

  const existingAuction = await Auction.findById(auctionId);

  if (!existingAuction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Auction not found');
  }

  // Handle file uploads for images and PDFs
  if (files) {
    // @ts-ignore
    if (files.images) {
      // @ts-ignore
      auctionData.carDetails = {
        ...auctionData.carDetails,
        images: files.images.map((file: any) => file.path),
      };
    }

    // @ts-ignore
    if (files.pdfs) {
      // @ts-ignore
      auctionData.carDetails = {
        ...auctionData.carDetails,
        documents: files.pdfs.map((file: any) => ({
          originalname: file.originalname,
          path: file.path,
        })),
      };
    }
  }
  // Determine whether the user is a buyer or seller based on the activeAs field in the respective model
  let isSeller = false;
  let isBuyer = false;

  // Try to find the user in the PrivateCustomer or BusinessCustomer model
  const privateCustomer = await PrivateCustomer.findOne({ userId });
  const businessCustomer = await BusinessCustomer.findOne({ userId });

  if (privateCustomer && privateCustomer.activeAs) {
    isSeller = privateCustomer.activeAs === 'seller';
    isBuyer = privateCustomer.activeAs === 'buyer';
  } else if (businessCustomer && businessCustomer.activeAs) {
    isSeller = businessCustomer.activeAs === 'seller';
    isBuyer = businessCustomer.activeAs === 'buyer';
  }

  // Update the corresponding field based on the role (buyer or seller)
  if (isSeller) {
    auctionData.sellerDetails = userId;
  } else if (isBuyer) {
    auctionData.buyerDetails = userId;
  }

  // Combine existing auction details with updated fields
  const updatedAuctionData: Partial<IAuction> = {
    carDetails: {
      ...existingAuction.carDetails,
      ...auctionData.carDetails,
    },
    auctionDetails: {
      ...existingAuction.auctionDetails,
      ...auctionData.auctionDetails,
    },
    buyerDetails: auctionData.buyerDetails ?? existingAuction.buyerDetails,
    sellerDetails: auctionData.sellerDetails ?? existingAuction.sellerDetails,
  };

  // Validate the updated data with Zod
  await AuctionValidation.updateAuctionZodSchema.parseAsync(updatedAuctionData);

  // Perform the update in the database
  const updatedAuction = await Auction.findByIdAndUpdate(
    auctionId,
    { $set: updatedAuctionData },
    { new: true }
  )
    .populate({
      path: 'sellerDetails',
      populate: [
        { path: 'businessCustomer', model: 'BusinessCustomer' },
        { path: 'privateCustomer', model: 'PrivateCustomer' },
      ],
    })
    .exec();

  if (!updatedAuction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Auction not found after update');
  }

  return updatedAuction;
};

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