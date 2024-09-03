import express from 'express';
import uploadToCloudinary from '../../../config/cloudinary';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CarController } from './car.controller';
import { CarValidation } from './car.validations';

const router = express.Router();

router.post(
  '/create-car',
  // validateRequest(
  //   CarValidation.createCarZodSchema
  // ),
  uploadToCloudinary("car", [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]).fields([{ name: 'images', maxCount: 5 }]),
  // auth(ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  CarController.createCar
);

router.get('/:id', CarController.getSingleCar);

router.get('/', CarController.getAllCars);

router.patch(
  '/:id',
  validateRequest(
    CarValidation.updateCarZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CarController.updateCar
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CarController.deleteCar
);

export const CarRoutes = router;
