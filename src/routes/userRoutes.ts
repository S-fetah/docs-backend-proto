import { Router } from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController";
import { valUser } from "../middlewares/userValidation";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/add", valUser, addUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
