import { Router } from "express";
import {
  getAnimeById,
  searchAnimeByName,
} from "../controllers/animeController.js";

const router = Router();

router.get("/search", searchAnimeByName);
router.get("/:animeId", getAnimeById);

export default router;
