import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import { role } from './admin.constant';

const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: role,
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    contactNo: {
      type: String,
      unique: true,
      required: true,
    },
    socialSecurityNo: {
      type: String,
      unique: true,
      required: true,
    },
    profileImage: {
      type: String,
    }, 
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
  }
);

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
