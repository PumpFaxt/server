import { Express, Request, Response, NextFunction } from "express";
import { getAuthTokenFromHeader } from "../utils";
import jwt from "jsonwebtoken";
import User from "../models/User";

export function authorisedOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getAuthTokenFromHeader(req);

  if (!process.env.ACCESS_TOKEN_SECRET) return res.sendStatus(500);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user: any) => {
    if (err) return res.status(200).send({ invalidToken: true });

    const dbUser = await User.findOne({ address: (user as any).address });

    if (!dbUser) return res.status(200).send({ invalidToken: true });

    req.user = dbUser;

    if (!req.user) return res.status(200).send({ invalidToken: true });

    next();
  });
}

export function unauthorisedOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getAuthTokenFromHeader(req);

  if (!process.env.ACCESS_TOKEN_SECRET) return res.sendStatus(500);

  if (!token) return next();

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (!err) return res.sendStatus(403);
    next();
  });
}
