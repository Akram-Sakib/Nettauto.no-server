import express, { NextFunction, Request, Response } from 'express';
import uploadToCloudinary from '../../../config/cloudinary';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AuctionController } from './auction.controller';

const router = express.Router();

router.post(
  '/create-auction',
  auth(ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  uploadToCloudinary("auction", [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ]).fields([{ name: 'images', maxCount: 5 }, { name: 'pdfs', maxCount: 5 }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    return AuctionController.createAuction(req, res, next)
  }
);

router.get('/:id', AuctionController.getSingleAuction);

router.get('/', AuctionController.getAllAuctions);

router.patch(
  '/:auctionId',
  auth(ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  uploadToCloudinary('auction', [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ]).fields([{ name: 'images', maxCount: 5 }, { name: 'pdfs', maxCount: 5 }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return AuctionController.updateAuction(req, res, next);
  }
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AuctionController.deleteAuction
);

export const AuctionRoutes = router;
