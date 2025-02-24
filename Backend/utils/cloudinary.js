import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dniu1zxdq",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
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
      transformation: [
        { width: 1920, height: 600, crop: "fill" }
      ]
    });
  
    // Delete local file after upload
    if (response) fs.unlinkSync(localFilePath);
    return response;
} catch (error) {
    console.error("Banner upload error:", error);
    fs.unlinkSync(localFilePath);
    return null
  
}
}
export { uploadImagesToCloudinary, uploadPdftoCloudinary, uploadBannersTOCloudinary };
