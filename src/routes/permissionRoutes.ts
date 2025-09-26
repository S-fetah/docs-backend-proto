import { Router } from "express";

import {
  addPermission,
  updatePermission,
  deletePermission,
  getPermissions,
} from "../controllers/permissionController";

const router = Router();

router.get("/", getPermissions);
router.post("/add", addPermission);
router.put("/update", updatePermission);
router.delete("/delete", deletePermission);

export default router;
