import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../../helper/jwtHelper";

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
    throw new Error("Incorrect password.");
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
    needPasswordChange:user?.needPasswordChange
  };
};

export const AuthServices = {
  login,
};
