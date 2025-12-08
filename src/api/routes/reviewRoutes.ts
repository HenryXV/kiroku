import { Router } from "express";
import {
  createReview,
  getAnimeReviews,
  getAnimeReviewsByUser,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authHandler.js";

const router = Router();

router.post("/", protect, createReview);
router.get("/user", protect, getAnimeReviewsByUser);
router.get("/:animeId", getAnimeReviews);

export default router;
