import express from 'express';
import uploadToCloudinary from '../../../config/cloudinary';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BidController } from './bid.controller';
import { BidValidation } from './bid.validations';

const router = express.Router();

router.post(
  '/create-Bid',
  // validateRequest(
  //   BidValidation.createBidZodSchema
  // ),
  uploadToCloudinary("Bid", [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ]).fields([{ name: 'images', maxCount: 5 }, { name: 'pdfs', maxCount: 5 }]),
  // auth(ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  BidController.createBid
);

router.get('/:id', BidController.getSingleBid);

router.get('/', BidController.getAllBids);

router.patch(
  '/:id',
  validateRequest(
    BidValidation.updateBidZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BidController.updateBid
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BidController.deleteBid
);

export const BidRoutes = router;
