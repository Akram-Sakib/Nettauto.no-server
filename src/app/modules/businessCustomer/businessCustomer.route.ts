import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BusinessCustomerController } from './businessCustomer.controller';
import { BusinessCustomerValidaion } from './businessCustomer.validation';
const router = express.Router();

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
  ),
  BusinessCustomerController.getSingleBusinessCustomer
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BusinessCustomerController.deleteBusinessCustomer
);

router.patch(
  '/:id',
  validateRequest(BusinessCustomerValidaion.updateBusinessCustomerZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BusinessCustomerController.updateBusinessCustomer
);
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
  ),
  BusinessCustomerController.getAllBusinessCustomers
);

export const BusinessCustomerRoutes = router;
