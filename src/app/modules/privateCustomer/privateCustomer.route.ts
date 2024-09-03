import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PrivateCustomerController } from './privateCustomer.controller';
import { PrivateCustomerValidation } from './privateCustomer.validations';

const router = express.Router();

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
  ),
  PrivateCustomerController.getSinglePrivateCustomer
);

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
  ),
  PrivateCustomerController.getAllFaculties
);

router.patch(
  '/:id',
  validateRequest(PrivateCustomerValidation.updatePrivateCustomerZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  PrivateCustomerController.updatePrivateCustomer
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  PrivateCustomerController.deletePrivateCustomer
);

export const PrivateCustomerRoutes = router;
