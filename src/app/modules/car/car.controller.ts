import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CarFilterableFields } from './car.constants';
import { ICar } from './car.interfaces';
import { CarService } from './car.service';
import { CarValidation } from './car.validations';

const createCar = catchAsync(async (req: Request, res: Response) => {
  const files = req.files;

  if (!files) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "File isn't Upload Properly",
    );
  } else {
    // @ts-ignore
    req.body.images = files.images.map((file) => file.path);
  }
  await CarValidation.createCarZodSchema.parseAsync(req.body);

  const result = await CarService.createCar(req.body);

  sendResponse<ICar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car Created successfully',
    data: result,
  });
});

const getSingleCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CarService.getSingleCar(id);

  sendResponse<ICar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car fetched successfully',
    data: result,
  });
});

const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CarFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CarService.getAllCars(
    filters,
    paginationOptions
  );

  sendResponse<ICar[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cars fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CarService.updateCar(id, req.body);

  sendResponse<ICar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: result,
  });
});

const deleteCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CarService.deleteCar(id);

  sendResponse<ICar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car deleted successfully',
    data: result,
  });
});

export const CarController = {
  createCar,
  getSingleCar,
  getAllCars,
  updateCar,
  deleteCar,
};
