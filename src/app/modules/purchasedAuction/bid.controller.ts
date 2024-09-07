import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BidFilterableFields } from './bid.constants';
import { IBid } from './bid.interfaces';
import { BidService } from './bid.service';
import { BidValidation } from './bid.validations';

const createBid = catchAsync(async (req: Request, res: Response) => {
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
  await BidValidation.createBidZodSchema.parseAsync(req.body);

  const result = await BidService.createBid(req.body);

  sendResponse<IBid>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bid Created successfully',
    data: result,
  });
});

const getSingleBid = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BidService.getSingleBid(id);

  sendResponse<IBid>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bid fetched successfully',
    data: result,
  });
});

const getAllBids = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BidFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BidService.getAllBids(
    filters,
    paginationOptions
  );

  sendResponse<IBid[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bids Fetched Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateBid = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BidService.updateBid(id, req.body);

  sendResponse<IBid>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bid updated successfully',
    data: result,
  });
});

const deleteBid = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BidService.deleteBid(id);

  sendResponse<IBid>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bid deleted successfully',
    data: result,
  });
});

export const BidController = {
  createBid,
  getSingleBid,
  getAllBids,
  updateBid,
  deleteBid,
};
