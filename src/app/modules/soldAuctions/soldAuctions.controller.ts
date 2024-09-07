import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { SoldAuctionFilterableFields } from './soldAuctions.constants';
import { ISoldAuction } from './soldAuctions.interfaces';
import { SoldAuctionService } from './soldAuctions.service';
import { SoldAuctionValidation } from './soldAuctions.validations';

const createSoldAuction = catchAsync(async (req: Request, res: Response) => {

  await SoldAuctionValidation.createSoldAuctionZodSchema.parseAsync(req.body);

  const result = await SoldAuctionService.createSoldAuction(req.body);

  sendResponse<ISoldAuction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SoldAuction Created successfully',
    data: result,
  });
});

const getSingleSoldAuction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SoldAuctionService.getSingleSoldAuction(id);

  sendResponse<ISoldAuction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SoldAuction fetched successfully',
    data: result,
  });
});

const getAllSoldAuctions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, SoldAuctionFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SoldAuctionService.getAllSoldAuctions(
    filters,
    paginationOptions
  );

  sendResponse<ISoldAuction[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SoldAuctions Fetched Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateSoldAuction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SoldAuctionService.updateSoldAuction(id, req.body);

  sendResponse<ISoldAuction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SoldAuction updated successfully',
    data: result,
  });
});

const deleteSoldAuction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SoldAuctionService.deleteSoldAuction(id);

  sendResponse<ISoldAuction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SoldAuction deleted successfully',
    data: result,
  });
});

export const SoldAuctionController = {
  createSoldAuction,
  getSingleSoldAuction,
  getAllSoldAuctions,
  updateSoldAuction,
  deleteSoldAuction,
};
