import type { Request, Response, NextFunction } from "express";
import animeService from "../services/animeService.js";

export const getAnimeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.animeId as string, 10);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid anime ID provided." });
    }

    const animeData = await animeService.getAnimeById(id);

    if (!animeData) {
      return res
        .status(404)
        .json({ message: `Anime not found for ID: ${id}.` });
    }
    return res.status(200).json({ success: true, data: animeData });
  } catch (err) {
    return next(err);
  }
};

export const getAnimeRecommendationsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.animeId as string, 10);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid anime ID provided" });
    }

    const animesData = await animeService.getAnimeRecommendationsById(id);

    if (!animesData) {
      return res
        .status(404)
        .json({ message: `No recommendations found for ID: ${id}.` });
    }

    return res.status(200).json({ success: true, data: animesData });
  } catch (err) {
    return next(err);
  }
};

export const searchAnimeByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string" || q.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'A search query "q" with at least 3 characters is required.',
      });
    }

    const results = await animeService.searchAnimeByName(q);

    return res.status(200).json({ success: true, data: results });
  } catch (err) {
    return next(err);
  }
};
