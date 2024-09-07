import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { NotificationSearchableFields } from './notification.constants';
import {
  INotification,
  INotificationFilters
} from './notification.interfaces';
import { Notification } from './notification.model';

const createNotification = async (NotificationData: INotification) => {

  const Notification = new Notification(NotificationData);
  return await Notification.save();
}

const getSingleNotification = async (
  id: string
): Promise<INotification | null> => {
  const result = await Notification.findById(id)

  return result;
};

const getAllNotifications = async (
  filters: INotificationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<INotification[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: NotificationSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $paginationOptions: 'i',
        },
      })),
    });
  }

  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // If there is no condition , put {} to give all data
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Notification.find(whereConditions)
    // .populate('Notification')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateNotification = async (
  id: string, data: Partial<INotification>, images?: Express.Multer.File[]
): Promise<INotification | null> => {
  const Notification = await Notification.findById(id);
  if (!Notification) throw new Error('Notification not found');

  if (images) {
    const imageUrls = images.map((image) => image.path);
    Notification.carDetails.images.push(...imageUrls);
  }
  Object.assign(Notification, data);

  return Notification.save();
  // const result = await Notification.findOneAndUpdate(
  //   { _id: id },
  //   payload,
  //   {
  //     new: true,
  //   }
  // );

  // return result;
};

// async updateNotification(id: string, data: Partial<INotification>, images ?: Express.Multer.File[]) {
//   const Notification = await NotificationModel.findById(id);
//   if (!Notification) throw new Error('Notification not found');

//   if (images) {
//     const imageUrls = images.map((image) => image.path);
//     Notification.images.push(...imageUrls);
//   }

//   Object.assign(Notification, data);
//   return Notification.save();
// }

const deleteNotification = async (
  id: string
): Promise<INotification | null> => {
  const result = await Notification.findByIdAndDelete(id);
  return result;
};



export const NotificationService = {
  createNotification,
  getSingleNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
};
