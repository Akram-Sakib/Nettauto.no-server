import { Model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  id: string;
  name: UserName;
  profileImage: string;
  dateOfBirth?: string;
  email: string;
  socialSecurityNo: string;
  contactNo: string;
  role: ENUM_USER_ROLE.SUPER_ADMIN | ENUM_USER_ROLE.ADMIN;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
};
