import express from 'express';
import uploadToCloudinary from '../../../config/cloudinary';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { NotificationController } from './notification.controller';
import { NotificationValidation } from './notification.validations';

const router = express.Router();

router.post(
  '/create-Notification',
  // auth(ENUM_USER_ROLE.BUSINESSCUSTOMER, ENUM_USER_ROLE.PRIVATECUSTOMER),
  NotificationController.createNotification
);

router.get('/:id', NotificationController.getSingleNotification);

router.get('/', NotificationController.getAllNotifications);

router.patch(
  '/:id',
  validateRequest(
    NotificationValidation.updateNotificationZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  NotificationController.updateNotification
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  NotificationController.deleteNotification
);

export const NotificationRoutes = router;
