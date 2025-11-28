import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString }, { schema: "public" });
const prisma = new PrismaClient({ adapter });

const register = async (userData: {
  email: string;
  password: string;
  username: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 is the salt

  return prisma.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
    },
  });
};

const login = async (credentials: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, `${process.env.JWT_SECRET}`, {
    expiresIn: "8h",
  });
};

export default { register, login };
