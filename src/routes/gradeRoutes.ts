import { Router } from "express";

import {
  addGrade,
  updateGrade,
  deleteGrade,
  getGrades,
  assignGrade,
  unassignGrade,
  reassignGrade,
  getAssignedUsers,
} from "../controllers/gradeController";

const router = Router();

router.get("/", getGrades);
router.get("/assigned", getAssignedUsers);
router.get("/assigned/:grade", getAssignedUsers);

router.post("/add", addGrade);
router.post("/assign", assignGrade);

router.put("/update", updateGrade);
router.put("/reassign", reassignGrade);

router.delete("/delete", deleteGrade);
router.delete("/unassign", unassignGrade);

export default router;
