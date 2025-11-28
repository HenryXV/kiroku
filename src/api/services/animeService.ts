import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import Jikan, { Anime } from "jikan4.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString }, { schema: "public" });
const prisma = new PrismaClient({ adapter });
const jikan = new Jikan.Client();

const getAnimeById = async (id: number) => {
  const animeFromDb = await prisma.anime.findUnique({
    where: { jikanId: id },
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

  return prisma.anime.create(createAnimeObject(animeFromJikan));
};

const searchAnimeByName = async (name: string) => {
  const searchString = name.toString();
  console.log(`Searching for anime with name: ${searchString}`);
  const resultsUpsertPromises = (await jikan.anime.search(searchString)).map(
    (anime) => {
      const animeData = createAnimeObject(anime);

      return prisma.anime.upsert({
        where: { jikanId: anime.id },
        update: animeData.data,
        create: animeData.data,
      });
    },
  );

  return await Promise.all(resultsUpsertPromises);
};

const createAnimeObject = (anime: Anime) => {
  return {
    data: {
      jikanId: anime.id,
      title: anime.title.toString(),
      imageUrl: anime.image.jpg?.default?.toString(),
      synopsis: anime.synopsis?.toString(),
      episodes: anime.episodes,
      score: anime.score,
      status: anime.airInfo.status.toString(),
    },
  };
};

export default { getAnimeById, searchAnimeByName };
