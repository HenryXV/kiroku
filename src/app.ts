import express from "express";
import jikanApiRoutes from "./api/routes/jikanApiRoutes.ts";
import { errorHandler } from "./api/middlewares/errorHandler.ts";

const app = express();

app.use(express.json());

app.use("/api/v1", jikanApiRoutes);

app.use(errorHandler);

export default app;
