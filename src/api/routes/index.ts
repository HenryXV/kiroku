import { Router } from "express";
import animeRoutes from "./animeRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/anime", animeRoutes);
router.use("/user", userRoutes);

export default router;
