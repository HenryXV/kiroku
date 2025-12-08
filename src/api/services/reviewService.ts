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

  if (anime) {
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
  }

  return null;
};

const getReviewsById = async (jikanId: number) => {
  const anime = await prisma.anime.findUnique({
    where: { jikanId: jikanId },
  });

  if (!anime) return [];

  return prisma.review.findMany({
    where: { animeId: anime.id },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true } },
    },
  });
};

const getReviewsByUser = async (userId: number) => {
  return prisma.review.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true } },
    },
  });
};

export default {
  createReview,
  getReviewsById,
  getReviewsByUser,
};
