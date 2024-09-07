import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AuctionFilterableFields } from './auction.constants';
import { IAuction } from './auction.interfaces';
import { AuctionService } from './auction.service';
import { AuctionValidation } from './auction.validations';

const createAuction = catchAsync(async (req: Request, res: Response) => {
  const files = req.files;
  const userId = (req.user as JwtPayload).userId;

  const { carDetails, auctionDetails, buyerDetails } = req.body

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

  const result = await AuctionService.createAuction(auctionData);

  sendResponse<IAuction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Auction Created successfully',
    data: result,
  });
});

const getSingleAuction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuctionService.getSingleAuction(id);

  sendResponse<IAuction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Auction fetched successfully',
    data: result,
  });
});

const getAllAuctions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, AuctionFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AuctionService.getAllAuctions(
    filters,
    paginationOptions
  );

  sendResponse<IAuction[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Auctions Fetched Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateAuction = catchAsync(async (req: Request, res: Response) => {

  const { auctionId } = req.params;
  const files = req.files;
  const userId = (req.user as JwtPayload).userId;
  const auctionData = req.body;


  const result = await AuctionService.updateAuction(auctionId, auctionData, files, userId);

  sendResponse<IAuction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Auction updated successfully',
    data: result,
  });
});

const deleteAuction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuctionService.deleteAuction(id);

  sendResponse<IAuction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Auction deleted successfully',
    data: result,
  });
});

export const AuctionController = {
  createAuction,
  getSingleAuction,
  getAllAuctions,
  updateAuction,
  deleteAuction,
};
