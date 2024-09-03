import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { businessCustomerFilterableFields } from './businessCustomer.constant';
import { IBusinessCustomer } from './businessCustomer.interface';
import { BusinessCustomerService } from './businessCustomer.service';

const getSingleBusinessCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BusinessCustomerService.getSingleBusinessCustomer(id);

  sendResponse<IBusinessCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'BusinessCustomer fetched successfully !',
    data: result,
  });
});

const getAllBusinessCustomers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, businessCustomerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BusinessCustomerService.getAllBusinessCustomers(
    filters,
    paginationOptions
  );

  sendResponse<IBusinessCustomer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'BusinessCustomers fetched successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const updateBusinessCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await BusinessCustomerService.updateBusinessCustomer(id, updatedData);

  sendResponse<IBusinessCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'BusinessCustomer updated successfully !',
    data: result,
  });
});
const deleteBusinessCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BusinessCustomerService.deleteBusinessCustomer(id);

  sendResponse<IBusinessCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'BusinessCustomer Deleted successfully !',
    data: result,
  });
});

export const BusinessCustomerController = {
  getSingleBusinessCustomer,
  getAllBusinessCustomers,
  updateBusinessCustomer,
  deleteBusinessCustomer,
};
