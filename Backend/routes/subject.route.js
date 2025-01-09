import { Router } from "express";
import { addSubject,getAllSubjectsByExamId } from "../controllers/subject.controller.js";
const router = Router();

router.post("/addsubject", addSubject);
router.get("/getallsubjects/:examId", getAllSubjectsByExamId);
export default router;