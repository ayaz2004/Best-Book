import { Router } from "express";
import {
  getBookById,
  getBooks,
  uploadBooks,
  deleteBook,
  updateBook,
  getPopularBooks,
  getAllBooksByExams
} from "../controllers/book.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();


// admin upload books
router.post(
  "/admin/uploadbook",
  upload.fields([
    {
      // field name in frontend
      name: "coverImage",
      maxCount: 1,
    },
    {
      // field name in frontend
      name: "eBook",
      maxCount: 3,
    },
  ]),
  uploadBooks
);

// admin get list of all books
router.get("/admin/getbook", getBooks);
// admin delete a particular book by passing id
router.delete("/admin/deletebook/:bookId", deleteBook);
// admin update a particular book by passing id
router.put("/admin/updatebook/:bookId", updateBook);

// for gettting details of book by id
router.get("/getbookbyid/:bookId", getBookById);
// for getting all books by exam
router.get("/getbookbyexam/:exam", getAllBooksByExams);
// new route for fetching popular books
router.get("/popularBooks", getPopularBooks);

export default router;
