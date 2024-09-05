import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.post(
  '/create-business-customer',
  validateRequest(UserValidation.createBusinessCustomerZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.BUSINESSCUSTOMER),
  UserController.createBusinessCustomer
);

router.post(
  '/create-private-customer',
  validateRequest(UserValidation.createPrivateCustomerZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.createPrivateCustomer
);

router.post(
  '/create-admin',
  validateRequest(UserValidation.createAdminZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.createAdmin
);

export const UserRoutes = router;
