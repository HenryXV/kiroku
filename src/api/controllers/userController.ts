import { Request, Response, NextFunction } from "express";
import userService from "../services/userService.js";
import { AppError } from "../middlewares/errorHandler.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !password || !username) {
      return next(
        new AppError("Email, username and password are required.", 400),
      );
    }

    const newUser = await userService.register({ email, username, password });

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (err) {
    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required.", 400));
    }

    const token = await userService.login({ email, password });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    return next(err);
  }
};
