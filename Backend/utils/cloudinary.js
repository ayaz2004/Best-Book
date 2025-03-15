import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: "dniu1zxdq",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import fs from "fs";
const uploadImagesToCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file is uploaded successfully", response.url);
    if (response) fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error(error);
    return null;
  }
};

const uploadPdftoCloudinary = async (pdfPath) => {
  try {
    const response = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "auto",
    });
    console.log("file is uploaded successfully", response.url);
    if (response) fs.unlinkSync(pdfPath);
    return response;
  } catch (error) {
    fs.unlinkSync(pdfPath);
    console.error(error);
    return null;
  }
};

const uploadBannersTOCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "banners",
      transformation: [{ width: 1920, height: 600, crop: "fill" }],
    });

    // Delete local file after upload
    if (response) fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Banner upload error:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteBannerFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

export {
  uploadImagesToCloudinary,
  uploadPdftoCloudinary,
  uploadBannersTOCloudinary,
  deleteBannerFromCloudinary,
};
