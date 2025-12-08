import { Router } from "express";
import {
  getAnimeById,
  getAnimeRecommendationsById,
  searchAnimeByName,
} from "../controllers/animeController.js";

const router = Router();

router.get("/search", searchAnimeByName);
router.get("/:animeId", getAnimeById);
router.get("/:animeId/recommendations", getAnimeRecommendationsById);

export default router;
