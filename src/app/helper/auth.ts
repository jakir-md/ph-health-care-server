import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./jwtHelper";
import config from "../../config";
import { ApiError } from "../error/apiError";
import httpStatus from "http-status";

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Access Token Not Found..");
      }

      const verifiedToken = verifyToken(
        token,
        config.jwt.access_token_secret as string
      );

      req.user = verifiedToken;

      if (roles.length && !roles.includes(verifiedToken?.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized.");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
