import { Router } from "express";
import { addExam,updateExam,getAllExams,getExamById,addOrUpdateTargetExamForClass,getTargetExamForClass } from "../controllers/exam.controller.js";
const router = Router();

router.post("/addexam", addExam);
router.put("/updateexam/:examId", updateExam);
router.get("/getallexams", getAllExams);
router.get("/getexam/:examId", getExamById);
router.post("/addtargetexam", addOrUpdateTargetExamForClass);
router.get("/getalltargetexam", getTargetExamForClass);
export default router;
