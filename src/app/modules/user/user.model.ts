/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, UserModel } from './user.interface';
import { accountStatus } from './user.constant';

const UserSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    accountStatus: {
      type: String,
      required: true,
      enum: accountStatus,
    },
    passwordChangedAt: {
      type: Date,
    },
    businessCustomer: {
      type: Schema.Types.ObjectId,
      ref: 'BusinessCustomer',
    },
    privateCustomer: {
      type: Schema.Types.ObjectId,
      ref: 'PrivateCustomer',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.statics.isUserExist = async function (
  email: string
): Promise<IUser | null> {
  return await User.findOne(
    { email },
    { id: 1, password: 1, role: 1, email: 1 }
  );
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.methods.changedPasswordAfterJwtIssued = function (
  jwtTimestamp: number
) {
  console.log({ jwtTimestamp }, 'hi');
};

// User.create() / user.save()
UserSchema.pre('save', async function (next) {
  // hashing user password
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );

  if (!user.needsPasswordChange) {
    user.passwordChangedAt = new Date();
  }

  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);

// UserSchema.methods.isUserExist = async function (
//   id: string
// ): Promise<Partial<IUser> | null> {
//   return await User.findOne(
//     { id },
//     { id: 1, password: 1, needsPasswordChange: 1 }
//   );
// };

// UserSchema.methods.isPasswordMatched = async function (
//   givenPassword: string,
//   savedPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(givenPassword, savedPassword);
// };
