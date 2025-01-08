import { Router } from "express";
import { addSubject } from "../controllers/subject.controller.js";
const router = Router();

router.post("/addsubject", addSubject);
export default router;