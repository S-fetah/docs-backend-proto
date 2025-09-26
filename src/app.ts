import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandlers";
import express from "express";

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);

app.use(errorHandler);

export default app;
