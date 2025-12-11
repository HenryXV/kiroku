import animeService from "./animeService.js";
import prisma from "../../client.js";

interface CreateReviewData {
  userId: number;
  jikanId: number;
  rating: number;
  reviewText: string;
}

const createReview = async ({
  userId,
  jikanId,
  rating,
  reviewText,
}: CreateReviewData) => {
  const anime = await animeService.getAnimeById(jikanId);

  if (!anime) {
    throw new Error("Anime not found or could not be fetched.");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      userId: userId,
      animeId: anime.id,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this anime.");
  }

  return await prisma.review.create({
    data: {
      userId: userId,
      animeId: anime.id,
      rating: rating,
      reviewText: reviewText,
    },

    include: {
      anime: true,
      user: {
        select: { username: true },
      },
    },
  });
};

const getReviewsById = async (jikanId: number) => {
  return prisma.review.findMany({
    where: { anime: { jikanId: jikanId } },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true } },
      anime: {
        select: {
          jikanId: true,
        },
      },
    },
  });
};

const getReviewsByUser = async (userId: number) => {
  return prisma.review.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true } },
      anime: { select: { jikanId: true } },
    },
  });
};

export default {
  createReview,
  getReviewsById,
  getReviewsByUser,
};
