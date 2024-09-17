import { Schema, model } from 'mongoose';
import { BusinessModel, IBusinessCustomer } from './businessCustomer.interface';

export const BusinessCustomerSchema = new Schema<IBusinessCustomer, BusinessModel>(
  {
    contactPerson: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    organizationNo: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    emailForNotifications: {
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
    city: {
      type: String,
      required: true,
    },
    address: {
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
      type: String,
    },
    profileImage: {
      type: String,
    },
    admin: {
      type: String,
      ref: "Admin"
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const BusinessCustomer = model<IBusinessCustomer, BusinessModel>('BusinessCustomer', BusinessCustomerSchema);
