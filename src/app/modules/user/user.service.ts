import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IBusinessCustomer } from '../businessCustomer/businessCustomer.interface';
import { BusinessCustomer } from '../businessCustomer/businessCustomer.model';
import { IPrivateCustomer } from '../privateCustomer/privateCustomer.interface';
import { PrivateCustomer } from '../privateCustomer/privateCustomer.model';
import { IUser } from './user.interface';
import { User } from './user.model';


const createBusinessCustomer = async (
  businessCustomer: IBusinessCustomer,
  user: IUser
): Promise<IUser | null> => {
  // If password is not given,set default password
  if (!user.password) {
    user.password = config.default_business_customer_pass as string;
  }

  // set role
  user.role = 'business_customer';
  businessCustomer.email = user.email

  const isBusinessCustomerAlreadyExist = await BusinessCustomer.findOne({
    email: businessCustomer.email
  }
  ).lean();

  if (isBusinessCustomerAlreadyExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Business Customer Already Exist');
  }

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Create businessCustomer using sesssion
    const newBusinessCustomer = await BusinessCustomer.create([businessCustomer], { session });

    if (!newBusinessCustomer.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create businessCustomer');
    }
    console.log(newBusinessCustomer);

    // set businessCustomer _id (reference) into user.businessCustomer
    user.businessCustomer = newBusinessCustomer[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findById(newUserAllData._id)
      .populate({
        path: 'businessCustomer',
        // populate: [
        //   {
        //     path: 'Semester',
        //   },
        //   {
        //     path: 'Auction',
        //   },
        //   {
        //     path: 'PrivateCustomer',
        //   },
        // ],
      });
  }

  return newUserAllData;
};

const createPrivateCustomer = async (
  privateCustomer: IPrivateCustomer,
  user: IUser
): Promise<IUser | null> => {
  // If password is not given,set default password
  if (!user.password) {
    user.password = config.default_private_customer_pass as string;
  }

  // set role
  user.role = 'private_customer';
  privateCustomer.email = user.email

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Create privateCustomer using sesssin
    const newPrivateCustomer = await PrivateCustomer.create([privateCustomer], { session });

    if (!newPrivateCustomer.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create privateCustomer ');
    }
    // set privateCustomer _id (reference) into user.businessCustomer
    user.privateCustomer = newPrivateCustomer[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create privateCustomer');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findById(newUserAllData._id).populate({
      path: 'privateCustomer',
      // populate: [
      //   {
      //     path: 'Auction',
      //   },
      //   {
      //     path: 'PrivateCustomer',
      //   },
      // ],
    });
  };


  return newUserAllData;
};

const createAdmin = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  // If password is not given,set default password
  if (!user.password) {
    user.password = config.default_admin_pass as string;
  }
  // set role
  user.role = 'admin';

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();


    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create privateCustomer ');
    }

    user.admin = newAdmin[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'admin',
      // populate: [
      //   {
      //     path: 'managementAuction',
      //   },
      // ],
    });
  }

  return newUserAllData;
};

export const UserService = {
  createBusinessCustomer,
  createPrivateCustomer,
  createAdmin,
};
