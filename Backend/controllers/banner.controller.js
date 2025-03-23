import { Banner } from "../models/banners.model.js";
import {
  uploadBannersTOCloudinary,
  deleteBannerFromCloudinary,
} from "../utils/cloudinary.js";
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
    const { redirectUrl, targetExams } = req.body;

    const banner = new Banner({
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      redirectUrl: redirectUrl,
      targetExams: targetExams ? JSON.parse(targetExams) : [],
      isActive: true,
    });

    await banner.save();

    res.status(201).json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Banner upload error:", error);
    next(errorHandler(500, "Error uploading banner"));
  }
};

export const getTopBanners = async (req, res, next) => {
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
    next(errorHandler(500, "Error fetching banners"));
  }
};

export const deleteBanner = async (req, res, next) => {
  const user = req.user;
  console.log("user", user);

  if (!user || user.isAdmin === false) {
    return next(errorHandler(401, "Unauthorized"));
  }

  const { id } = req.params;

  try {
    const banner = await Banner.findById(id);

    if (!banner) {
      return next(errorHandler(404, "Banner not found"));
    }

    // Delete image from Cloudinary
    if (banner.cloudinaryId) {
      await deleteBannerFromCloudinary(banner.cloudinaryId);
    }

    // Delete banner from database
    await Banner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({
      message: "Error deleting banner",
      error: error.message,
    });
  }
};

export const getTargetedBanners = async (req, res, next) => {
  try {
    const user = req.user;
    console.log("user", user);

    if (!user) {
      return next(errorHandler(401, "Unauthorized"));
    }

    // Get banners where targetExams contains at least one of the user's target exams
    // OR where targetExams array is empty (banners for everyone)
    const banners = await Banner.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { targetExams: { $in: user.targetExam } },
            { targetExams: { $size: 0 } },
          ],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Error fetching targeted banners:", error);
    res.status(500).json({
      message: "Error fetching banners",
      error: error.message,
    });
  }
};

export const getAllBanners = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.isAdmin === false) {
      return next(errorHandler(401, "Unauthorized"));
    }

    // Get all banners for admin use
    const banners = await Banner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Error fetching all banners:", error);
    res.status(500).json({
      message: "Error fetching banners",
      error: error.message,
    });
  }
};

export const toggleBannerActive = async (req, res, next) => {
  const user = req.user;

  if (!user || user.isAdmin === false) {
    return next(errorHandler(401, "Unauthorized"));
  }

  const { id } = req.params;

  try {
    const banner = await Banner.findById(id);

    if (!banner) {
      return next(errorHandler(404, "Banner not found"));
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      isActive: banner.isActive,
    });
  } catch (error) {
    console.error("Error toggling banner status:", error);
    res.status(500).json({
      message: "Error updating banner",
      error: error.message,
    });
  }
};
