import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BidFilterableFields } from './bid.constants';
import { IBid } from './bid.interfaces';
import { BidService } from './bid.service';

const createBid = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload).userId

  const result = await BidService.createBid(userId, req.body);

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
    message: 'Bid Fetched successfully',
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
