import { Request, Response } from 'express';
import httpStatus from 'http-status';
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
  // console.log(req.body.equipment);
  
  if (!files) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "File isn't Upload Properly",
    );
  } else {
    // @ts-ignore
    req.body.images = files.images.map((file) => file.path);
    // @ts-ignore
    req.body.documents = files.pdfs.map((file) => ({ originalname: file.originalname, path: file.path }));
  }
  await AuctionValidation.createAuctionZodSchema.parseAsync(req.body);

  const result = await AuctionService.createAuction(req.body);

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
  const { id } = req.params;
  const result = await AuctionService.updateAuction(id, req.body);

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
