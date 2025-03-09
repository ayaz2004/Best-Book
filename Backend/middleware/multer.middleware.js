import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./public";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    console.log("Saving to directory:", dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    console.log("Saving file:", file.originalname);
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "coverImage" || file.fieldname === "bookImages" || file.fieldname === "banners") {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
  } else if (file.fieldname === "eBook") {
    // Accept PDFs only
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
  }
  cb(null, true);
};
export const upload = multer({ storage: storage, fileFilter: fileFilter,limits:{
  fileSize:20 * 1024 * 1024
} });
