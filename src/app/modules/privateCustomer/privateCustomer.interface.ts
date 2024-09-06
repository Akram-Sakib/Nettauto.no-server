import { Model, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IPrivateCustomer = {
  id: string;
  name: string; //embedded object
  dateOfBirth: string;
  emailForNotifications: string; //embedded object
  email: string;
  contactNo: string;
  postalNo: string;
  address: string;
  city: string;
  acceptTerms: boolean;
  auctionsEmail: boolean;
  bidEmail: boolean;
  isSeller: boolean
  isBuyer: boolean
  activeAs: "seller" | "buyer"
  profileImage?: string;
  admin?: Types.ObjectId | IAdmin
};

export type PrivateCustomerModel = Model<IPrivateCustomer, Record<string, unknown>>;

export type IPrivateCustomerFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
};
