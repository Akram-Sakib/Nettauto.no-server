//@ts-nocheck

import { v2 as cloudinary } from 'cloudinary';
import httpStatus from 'http-status';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import config from '.';
import ApiError from '../errors/ApiError';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});
// Function to create Cloudinary storage
const makeStorage = (folder: string) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      public_id: () => `NA/${folder}/` + new Date().getTime(),
    },

  });
};

type TmimeTypes = "image/png" | "image/jpeg" | "image/jpg" | "application/pdf";

const uploadToCloudinary = (
  folderToUpload: string,
  fileFilter: TmimeTypes[]
) => {
  const upload = multer({
    storage: makeStorage(folderToUpload),
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {

      if (fileFilter.includes(file.mimetype as TmimeTypes)) {
        cb(null, true);
      } else {
        cb(new ApiError(httpStatus.BAD_REQUEST, "Invalid File Format"));
      }
    },
  });
  return upload;
};

export default uploadToCloudinary;
