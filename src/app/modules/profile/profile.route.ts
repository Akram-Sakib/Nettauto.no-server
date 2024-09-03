import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ProfileController } from './profile.controller';

const router = express.Router();
router.get(
  '/me',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.BUSINESSCUSTOMER,
    ENUM_USER_ROLE.PRIVATECUSTOMER,
  ),
  ProfileController.getMyProfile
);

router.patch(
  '/me/update',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.BUSINESSCUSTOMER,
    ENUM_USER_ROLE.PRIVATECUSTOMER
  ),
  // FileUploadHelper.upload.single('file'),
  // (req: Request, res: Response, next: NextFunction) => {
  //   const role = (req.user as JwtPayload).role;

  //   if (role === ENUM_USER_ROLE.PRIVATECUSTOMER) {
  //     req.body = SellerValidation.updateSeller.parse(JSON.parse(req.body.data));
  //   } else if (role === ENUM_USER_ROLE.BUSINESSCUSTOMER) {
  //     req.body = buyerValidation.updateBuyer.parse(JSON.parse(req.body.data));
  //   } else {
  //     req.body = AdminValidation.updateAdmin.parse(JSON.parse(req.body.data));
  //   }

  //   return ProfileController.updateMyProfile(req, res, next);
  // },
  ProfileController.updateMyProfile
);

export const ProfileRoutes = router;