import express from 'express';
import uploadToCloudinary from '../../../config/cloudinary';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SoldAuctionController } from './soldAuctions.controller';
import { SoldAuctionValidation } from './soldAuctions.validations';

const router = express.Router();

router.post(
  '/create-soldAuction',
  // validateRequest(
  //   SoldAuctionValidation.createSoldAuctionZodSchema
  // ),
  // auth(ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  SoldAuctionController.createSoldAuction
);

router.get('/:id', SoldAuctionController.getSingleSoldAuction);

router.get('/', SoldAuctionController.getAllSoldAuctions);

router.patch(
  '/:id',
  validateRequest(
    SoldAuctionValidation.updateSoldAuctionZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SoldAuctionController.updateSoldAuction
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SoldAuctionController.deleteSoldAuction
);

export const SoldAuctionRoutes = router;
