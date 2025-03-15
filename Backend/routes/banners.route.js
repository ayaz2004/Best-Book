import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  getTopBanners,
  uploadBanner,
  deleteBanner,
  getTargetedBanners,
  getAllBanners,
  toggleBannerActive,
} from "../controllers/banner.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = Router();

router.post(
  "/uploadbanners",
  verifyToken,
  upload.fields([
    {
      name: "banners",
      maxCount: 1,
    },
  ]),
  uploadBanner
);

router.get("/topBanners", getTopBanners);
router.delete("/deleteBanner/:id", verifyToken, deleteBanner);
router.get("/targetedBanners", verifyToken, getTargetedBanners);
router.get("/allBanners", verifyToken, getAllBanners);
router.patch("/toggleBanner/:id", verifyToken, toggleBannerActive);

export default router;
