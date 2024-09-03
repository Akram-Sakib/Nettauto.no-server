import { Schema, model } from 'mongoose';
import {
  IManagementCar,
  ManagementCarModel,
} from './managementCar.inerface';

const ManagementCarSchema = new Schema<
  IManagementCar,
  ManagementCarModel
>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ManagementCar = model<
  IManagementCar,
  ManagementCarModel
>('ManagementCar', ManagementCarSchema);
