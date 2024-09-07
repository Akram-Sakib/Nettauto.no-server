import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AuctionFilterableFields } from './auction.constants';
import { IAuction } from './auction.interfaces';
import { AuctionService } from './auction.service';

const createAuction = catchAsync(async (req: Request, res: Response) => {
  const files = req.files;
  const userId = (req.user as JwtPayload).userId;
  const auctionData = req.body;

  const result = await AuctionService.createAuction(auctionData, files, userId);

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
