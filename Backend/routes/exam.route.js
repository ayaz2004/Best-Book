import { Router } from "express";
import { addExam,updateExam,getAllExams,getExamById } from "../controllers/exam.controller.js";
const router = Router();

router.post("/addexam", addExam);
router.put("/updateexam/:examId", updateExam);
router.get("/getallexams", getAllExams);
router.get("/getexam/:examId", getExamById);
export default router;
