import { Request, NextFunction, Response } from "express";
import { AppError } from "../middlewares/errorHandler.js";
import reviewService from "../services/reviewService.js";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("User not identified.", 404));
    }

    const { jikanId, rating, reviewText } = req.body;

    if (!jikanId || !rating) {
      return next(new AppError("Anime ID and Rating are required.", 400));
    }

    if (rating < 1 || rating > 10) {
      return next(new AppError("Rating must be between 1 and 10.", 400));
    }

    const review = await reviewService.createReview({
      userId,
      jikanId: parseInt(jikanId), // Ensure it's a number
      rating: parseInt(rating),
      reviewText,
    });

    if (review === null) {
      return next(new AppError("Could not create review.", 400));
    }

    return res.status(201).json({ success: true, data: review });
  } catch (err) {
    if ((err as any).message === "You have already reviewed this anime.") {
      return next(new AppError("You have already reviewed this anime.", 409));
    }
    return next(err);
  }
};

export const getAnimeReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.animeId as string, 10);

    const reviews = await reviewService.getReviewsById(id);

    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    return next(err);
  }
};

export const getAnimeReviewsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("User not identified.", 404));
    }

    const reviews = await reviewService.getReviewsByUser(userId);

    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    return next(err);
  }
};
