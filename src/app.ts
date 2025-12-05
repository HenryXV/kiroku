import express from "express";
import cors from "cors";
import { errorHandler } from "./api/middlewares/errorHandler.js";
import routes from "./api/routes/index.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
