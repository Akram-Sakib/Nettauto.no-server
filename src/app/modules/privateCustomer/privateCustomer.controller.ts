import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { privateCustomerFilterableFields } from './privateCustomer.constant';
import { IPrivateCustomer } from './privateCustomer.interface';
import { PrivateCustomerService } from './privateCustomer.service';

const getSinglePrivateCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PrivateCustomerService.getSinglePrivateCustomer(id);

  sendResponse<IPrivateCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PrivateCustomer fetched successfully !',
    data: result,
  });
});

const getAllPrivateCustomers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, privateCustomerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PrivateCustomerService.getAllFaculties(
    filters,
    paginationOptions
  );

  sendResponse<IPrivateCustomer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties fetched successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const updatePrivateCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await PrivateCustomerService.updatePrivateCustomer(id, updatedData);

  sendResponse<IPrivateCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PrivateCustomer updated successfully !',
    data: result,
  });
});

const deletePrivateCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PrivateCustomerService.deletePrivateCustomer(id);

  sendResponse<IPrivateCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PrivateCustomer deleted successfully !',
    data: result,
  });
});

export const PrivateCustomerController = {
  getSinglePrivateCustomer: getSinglePrivateCustomer,
  getAllFaculties: getAllPrivateCustomers,
  updatePrivateCustomer,
  deletePrivateCustomer,
};
