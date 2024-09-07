import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { NotificationFilterableFields } from './notification.constants';
import { INotification } from './notification.interfaces';
import { NotificationService } from './notification.service';
import { NotificationValidation } from './notification.validations';

const createNotification = catchAsync(async (req: Request, res: Response) => {
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
  await NotificationValidation.createNotificationZodSchema.parseAsync(req.body);

  const result = await NotificationService.createNotification(req.body);

  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification Created successfully',
    data: result,
  });
});

const getSingleNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.getSingleNotification(id);

  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification fetched successfully',
    data: result,
  });
});

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, NotificationFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await NotificationService.getAllNotifications(
    filters,
    paginationOptions
  );

  sendResponse<INotification[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications Fetched Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.updateNotification(id, req.body);

  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification updated successfully',
    data: result,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.deleteNotification(id);

  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: result,
  });
});

export const NotificationController = {
  createNotification,
  getSingleNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
};
