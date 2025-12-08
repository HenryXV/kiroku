import { Router } from "express";
import animeRoutes from "./animeRoutes.js";
import userRoutes from "./userRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

const router = Router();

router.use("/anime", animeRoutes);
router.use("/user", userRoutes);
router.use("/review", reviewRoutes);

export default router;
