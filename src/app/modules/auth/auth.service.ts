import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../../helper/jwtHelper";
import { ApiError } from "../../error/apiError";
import httpstatus from "http-status";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user?.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(httpstatus.BAD_REQUEST, "Incorrect password.");
  }

  const accesstoken = generateToken(
    { email: user?.email, role: user?.role },
    "abcPhHealth",
    "1h"
  );

  const refreshtoken = generateToken(
    { email: user?.email, role: user?.role },
    "abcPhHealth",
    "90d"
  );

  return {
    accesstoken,
    refreshtoken,
    needPasswordChange: user?.needPasswordChange,
  };
};

export const AuthServices = {
  login,
};
