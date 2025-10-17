import { UserRole } from "@prisma/client";

export type IJWTUser = {
  email: string;
  role: UserRole;
};
