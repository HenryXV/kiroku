import { Router } from "express";
import {
  getAnimeById,
  getAnimeRecommendationsById,
  getTopAnimes,
  searchAnimeByName,
} from "../controllers/animeController.js";

const router = Router();

router.get("/search", searchAnimeByName);
router.get("/top", getTopAnimes);
router.get("/:animeId", getAnimeById);
router.get("/:animeId/recommendations", getAnimeRecommendationsById);

export default router;
