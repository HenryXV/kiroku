// all requests should have the user payload
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Not authorized, no token", 401));
  }

  try {
    token = authHeader.split(" ")[1];

    if (!token) {
      return next(new AppError("Not authorized, no token", 401));
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET!);

    next();
  } catch (err) {
    return next(new AppError("Not authorized, token failed", 401));
  }
};
