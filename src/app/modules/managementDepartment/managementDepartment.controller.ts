import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { managementCarFilterableFields } from './managementCar.constant';
import { IManagementCar } from './managementCar.inerface';
import { ManagementCarService } from './managementCar.service';

const createCar = catchAsync(async (req: Request, res: Response) => {
  const { ...carData } = req.body;
  const result = await ManagementCarService.createCar(
    carData
  );

  sendResponse<IManagementCar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management car created successfully',
    data: result,
  });
});

const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, managementCarFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ManagementCarService.getAllCars(
    filters,
    paginationOptions
  );

  sendResponse<IManagementCar[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management cars fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ManagementCarService.getSingleCar(id);

  sendResponse<IManagementCar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management car fetched successfully',
    data: result,
  });
});

const updateCar = catchAsync(
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await ManagementCarService.updateCar(
      id,
      updatedData
    );

    sendResponse<IManagementCar>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Management car updated successfully',
      data: result,
    });
  })
);

const deleteCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ManagementCarService.deleteCar(id);

  sendResponse<IManagementCar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management car deleted successfully',
    data: result,
  });
});

export const ManagementCarController = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
};
