import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import ApiError from '../../../errors/ApiError';

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
      message: 'Private Customer created successfully!',
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
      message: 'Admin Created Successfully!',
      data: result,
    });
  }
);

const updateUserAccountStatusAndAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { adminId, accountStatus } = req.body;
  const { id } = req.params;

  // Ensure the adminId and accountStatus are provided
  if (!adminId || !accountStatus) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'adminId and accountStatus are required');
  }

  // Call the service to update the user
  const updatedUser = await UserService.updateUserAccountStatusAndAdmin(
    id,
    adminId,
    accountStatus
  );

  // Send response back
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User account status and admin updated successfully',
    data: updatedUser,
  });
});

export const getAllUsersController = async (req: Request, res: Response) => {

  // Fetch all users using the service
  const users = await UserService.getAllUsers();

  // Send response back
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Users fetched successfully',
    data: users,
  });

};

export const UserController = {
  createBusinessCustomer,
  createPrivateCustomer,
  createAdmin,
  updateUserAccountStatusAndAdmin, getAllUsersController
};