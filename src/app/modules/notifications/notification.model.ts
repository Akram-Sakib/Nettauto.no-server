import { model, Schema, Types } from 'mongoose';
import { NOTIFICATION_COLLECTION } from './notification.constants';
import {
  INotification,
  InotifyTo,
  NotificationModel
} from './notification.interfaces';

const NotificationSchema = new Schema<
  INotification,
  NotificationModel
>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User', // Assuming the user model is named 'User'
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    notifyTo: {
      type: String,
      enum: Object.values(InotifyTo),
      required: true,
    },
    notifyUrl: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Notification = model<
  INotification,
  NotificationModel
>(NOTIFICATION_COLLECTION, NotificationSchema);
