import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import Jikan, { Anime } from "jikan4.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString }, { schema: "public" });
const prisma = new PrismaClient({ adapter });
const jikan = new Jikan.Client();

const getAnimeById = async (id: number) => {
  const animeFromDb = await prisma.anime.findUnique({
    where: { jikanId: id }, // Look up by the Jikan ID
  });

  if (animeFromDb) {
    console.log(`Cache HIT for Jikan ID: ${id}`);
    return animeFromDb;
  }

  console.log(`Cache MISS for Jikan ID: ${id}. Fetching from API.`);
  const animeFromJikan = await jikan.anime.get(id);

  if (!animeFromJikan) {
    console.log(`Anime with id ${id} not found.`);
    return undefined;
  }

  return createAnimeFromJikan(animeFromJikan);
};

const searchAnimeByName = async (name: string) => {
  const searchString = name.toString();
  console.log(`Searching for anime with name: ${searchString}`);
  const results = (await jikan.anime.search(searchString)).map((anime) => {
    return {
      title: anime.title.default,
      year: anime.year,
    };
  });

  console.table(results);
  return results;
};

const createAnimeFromJikan = (anime: Anime) => {
  return prisma.anime.create({
    data: {
      jikanId: anime.id,
      title: anime.title.toString(),
      imageUrl: anime.image.jpg?.default?.toString(),
      synopsis: anime.synopsis?.toString(),
      episodes: anime.episodes,
      score: anime.score,
      status: anime.airInfo.status.toString(),
    },
  });
};

export default { getAnimeById, searchAnimeByName };
