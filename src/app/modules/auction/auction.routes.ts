import express from 'express';
import uploadToCloudinary from '../../../config/cloudinary';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuctionController } from './auction.controller';
import { AuctionValidation } from './auction.validations';

const router = express.Router();

router.post(
  '/create-auction',
  // validateRequest(
  //   AuctionValidation.createAuctionZodSchema
  // ),
  uploadToCloudinary("auction", [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ]).fields([{ name: 'images', maxCount: 5 }, { name: 'pdfs', maxCount: 5 }]),
  // auth(ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  AuctionController.createAuction
);

router.get('/:id', AuctionController.getSingleAuction);

router.get('/', AuctionController.getAllAuctions);

router.patch(
  '/:id',
  validateRequest(
    AuctionValidation.updateAuctionZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AuctionController.updateAuction
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AuctionController.deleteAuction
);

export const AuctionRoutes = router;
