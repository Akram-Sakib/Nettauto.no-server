import { JwtPayload } from 'jsonwebtoken';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IBusinessCustomer } from '../businessCustomer/businessCustomer.interface';
import { BusinessCustomer } from '../businessCustomer/businessCustomer.model';
import { IPrivateCustomer } from '../privateCustomer/privateCustomer.interface';
import { PrivateCustomer } from '../privateCustomer/privateCustomer.model';

const getMyProfile = async (
  user: JwtPayload | null
): Promise<IPrivateCustomer | IBusinessCustomer | IAdmin | null> => {
  let userData = null;
  console.log(user);

  if (user?.role === 'private_customer') {
    userData = await PrivateCustomer.findOne({
      email: user.email,
    });
  } else if (user?.role === 'business_customer') {
    userData = await BusinessCustomer.findOne({
      email: user.email,
    });
  } else {
    userData = await Admin.findOne({
      email: user?.email,
    });
  }

  if (!userData) {
    throw new Error('User not found');
  }

  return userData;
};

const updateMyProfile = async (
  req: Request,
  data: Partial<IPrivateCustomer | IBusinessCustomer | IAdmin>
): Promise<IPrivateCustomer | IBusinessCustomer | IAdmin | null> => {
  const user = (req as any).user as JwtPayload;

  let userData = null;
  if (user?.role === 'private_customer') {
    userData = await PrivateCustomer.findOne({
      email: user.email,
    });
  } else if (user?.role === 'business_customer') {
    userData = await BusinessCustomer.findOne({
      email: user.email,
    });
  } else {
    userData = await Admin.findOne({
      email: user?.email,
    });
  }

  // const file = req.file as IUploadFile;
  // if (file) {
  //   const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

  //   if (uploadedImage) {
  //     req.body.avatarUrl = uploadedImage.secure_url;
  //   }
  // }

  const filter = { email: user.email };
  const update = { ...data };


  if (!userData) {
    throw new Error('User not found');
  }

  if (user?.role === 'private_customer') {
    userData = await PrivateCustomer.findOneAndUpdate(filter, update, {
      new: true
    });
  } else if (user?.role === 'business_customer') {
    userData = await BusinessCustomer.findOneAndUpdate(filter, update, {
      new: true
    });
  } else {
    userData = await Admin.findOneAndUpdate(filter, update, {
      new: true
    });
  }

  return userData;
};

export const ProfileService = {
  getMyProfile,
  updateMyProfile,
};