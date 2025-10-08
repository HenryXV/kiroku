import type { Request, Response, NextFunction } from "express";
import Jikan from "jikan4.js";
const jikan = new Jikan.Client();

export const getAnime = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.animeId as string, 10);
    const anime = await jikan.anime.get(id);

    if (!anime) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json(anime);
  } catch (err) {
    next(err);
  }
};
