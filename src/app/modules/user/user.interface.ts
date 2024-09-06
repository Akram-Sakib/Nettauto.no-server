/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';
import { IBusinessCustomer } from '../businessCustomer/businessCustomer.interface';
import { IPrivateCustomer } from '../privateCustomer/privateCustomer.interface';
import { ENUM_ACCOUNT_STATUS } from '../../../enums/user';


export type IUser = {
  id: string;
  email: string;
  role: string;
  password: string;
  accountStatus: ENUM_ACCOUNT_STATUS;
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
