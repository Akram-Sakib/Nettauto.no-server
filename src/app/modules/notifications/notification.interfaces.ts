import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export enum InotifyTo {
  SELLER = "seller",
  BUYER = "buyer"
}

export type INotification = {
  user: Types.ObjectId | IUser
  message: string
  notifyTo: InotifyTo
  notifyUrl: string
  isRead: boolean
};

export type NotificationModel = Model<
  INotification,
  Record<string, unknown>
>;

export type INotificationFilters = {
  searchTerm?: string;
  NotificationAmount?: string
};