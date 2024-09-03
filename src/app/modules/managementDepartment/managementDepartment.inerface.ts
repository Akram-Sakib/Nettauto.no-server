import { Model } from 'mongoose';

export type IManagementCar = {
  title: string;
};

export type ManagementCarModel = Model<
  IManagementCar,
  Record<string, unknown>
>;

export type IManagementCarFilters = {
  searchTerm?: string;
};
