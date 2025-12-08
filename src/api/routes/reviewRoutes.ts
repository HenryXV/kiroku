import { Router } from "express";
import {
  createReview,
  getAnimeReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authHandler.js";

const router = Router();

router.post("/", protect, createReview);
router.get("/:animeId", getAnimeReviews);

export default router;
