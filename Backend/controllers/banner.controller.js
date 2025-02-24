import { Banner } from "../models/banners.model.js";
import { uploadBannersTOCloudinary } from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";

export const uploadBanner = async (req, res, next) => {
  const user = req.user;
  
  if (!user || user.isAdmin === false) {
    return next(errorHandler(401, "Unauthorized"));
  }

  const bannerPath = req.files?.banners[0]?.path;
  if (!bannerPath) {
    return next(errorHandler(400, "No banner image provided"));
  }
  try {
  
    const result = await uploadBannersTOCloudinary(bannerPath);

    const banner = new Banner({
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      isActive: true,
    });

    await banner.save();

    res.status(201).json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Banner upload error:", error);
    res.status(500).json({
      message: "Error uploading banner",
      error: error.message,
    });
  }
};

export const getTopBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      message: "Error fetching banners",
      error: error.message,
    });
  }
};
