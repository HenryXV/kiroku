import { Router } from "express";
import { getAnime } from "../controllers/jikanApiController.ts";

const router = Router();

router.get("/get-anime/:animeId", getAnime);

export default router;
