import { Router } from "express";
import animeRoutes from "./animeRoutes.js"; // <-- Import the new routes

const router = Router();

router.use("/anime", animeRoutes);

export default router;
