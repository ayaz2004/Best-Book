import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { uploadBanner } from "../controllers/banner.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = Router();

router.post("/uploadbanners",verifyToken,
    upload.fields([{
        name:"banners",
        maxCount:1
    }]), uploadBanner);

export default router