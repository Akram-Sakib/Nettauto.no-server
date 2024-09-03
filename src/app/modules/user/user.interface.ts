/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';
import { IBusinessCustomer } from '../businessCustomer/businessCustomer.interface';
import { IPrivateCustomer } from '../privateCustomer/privateCustomer.interface';

export type IUser = {
  id: string;
  email: string;
  role: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  businessCustomer?: Types.ObjectId | IBusinessCustomer;
  privateCustomer?: Types.ObjectId | IPrivateCustomer;
  admin?: Types.ObjectId | IAdmin;
};

export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
