import { Schema, model } from 'mongoose';
import { IPrivateCustomer, PrivateCustomerModel } from './privateCustomer.interface';

const PrivateCustomerSchema = new Schema<IPrivateCustomer, PrivateCustomerModel>(
  {
    // id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    contactNo: {
      type: String,
      unique: true,
      required: true,
    },
    postalNo: {
      type: String,
      required: true,
    },
    emailForNotifications: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    acceptTerms: {
      type: Boolean,
      required: true,
    },
    auctionsEmail: {
      type: Boolean,
      required: true,
    },
    bidEmail: {
      type: Boolean,
      required: true,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    isBuyer: {
      type: Boolean,
      default: false,
    },
    activeAs: {
      type: String
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const PrivateCustomer = model<IPrivateCustomer, PrivateCustomerModel>('PrivateCustomer', PrivateCustomerSchema);
