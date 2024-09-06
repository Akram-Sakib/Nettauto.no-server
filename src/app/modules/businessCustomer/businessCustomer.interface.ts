import { Model, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';

export type IBusinessCustomer = {
  id: string;
  contactPerson: string;
  dateOfBirth: string;
  email: string;
  emailForNotifications: string;
  contactNo: string;
  companyName: string;
  organizationNo: string;
  website: string;
  postalNo: string;
  address: string;
  city: string;
  acceptTerms: boolean;
  auctionsEmail: boolean;
  bidEmail: boolean;
  isSeller: boolean
  isBuyer: boolean
  activeAs: "seller" | "buyer"
  admin?: Types.ObjectId | IAdmin
  profileImage?: string;
};

export type BusinessModel = Model<IBusinessCustomer, Record<string, unknown>>;

export type IBusinessFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
};
