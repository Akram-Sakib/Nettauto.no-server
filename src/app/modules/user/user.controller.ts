import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const createBusinessCustomer: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { businessCustomer, ...userData } = req.body;

    const result = await UserService.createBusinessCustomer(businessCustomer, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Business Customer Created successfully!',
      data: result,
    });
  }
);

const createPrivateCustomer: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {

    const { privateCustomer, ...userData } = req.body;
    const result = await UserService.createPrivateCustomer(privateCustomer, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'PrivateCustomer created successfully!',
      data: result,
    });
  }
);

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { admin, ...userData } = req.body;
    const result = await UserService.createAdmin(admin, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  }
);

export const UserController = {
  createBusinessCustomer,
  createPrivateCustomer,
  createAdmin,
};
