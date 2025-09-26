import userRoutes from "./routes/userRoutes";
import gradeRoutes from "./routes/gradeRoutes";
import permissionRoutes from "./routes/permissionRoutes";
import {
  errorHandler,
  invalidRoutesHandler,
} from "./middlewares/errorHandlers";
import express from "express";

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/grade", gradeRoutes);
app.use("/api/permission", permissionRoutes);

app.use(invalidRoutesHandler);

app.use(errorHandler);

export default app;
