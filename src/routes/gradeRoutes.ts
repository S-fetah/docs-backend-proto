import { Router } from "express";

import {
  addGrade,
  updateGrade,
  deleteGrade,
  getGrades,
} from "../controllers/gradeController";

const router = Router();

router.get("/", getGrades);
router.post("/add", addGrade);
router.put("/update", updateGrade);
router.delete("/delete", deleteGrade);

export default router;
