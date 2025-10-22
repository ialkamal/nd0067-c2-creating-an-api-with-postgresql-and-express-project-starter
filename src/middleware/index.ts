import { Request, Response, NextFunction } from "express";
import { User } from "../helpers/types";
import jwt from "jsonwebtoken";

export const auth = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = jwt.verify(token || "", process.env.JWT_SECRET as string);
    // Ensure decoded is an object and contains expected user fields before assigning
    if (decoded && typeof decoded === "object" && "id" in decoded) {
      req.user = decoded as User;
      next();
      return;
    } else throw Error("Invalid or missing token");
  } catch (err) {
    res.status(401).json(err);
  }
};
