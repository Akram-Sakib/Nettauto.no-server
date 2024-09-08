import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BidController } from './bid.controller';
import { BidValidation } from './bid.validations';

const router = express.Router();

router.post(
  '/create-Bid',
  auth(ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  validateRequest(
    BidValidation.createBidZodSchema
  ),
  BidController.createBid
);

router.get('/:id', BidController.getSingleBid);

router.get('/', BidController.getAllBids);

router.patch(
  '/:id',
  validateRequest(
    BidValidation.updateBidZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  BidController.updateBid
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BidController.deleteBid
);

export const BidRoutes = router;
