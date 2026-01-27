import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";
import { Request } from "express";

const getCurrentUser = async (req: Request) => {
  return await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
};

export const UserService = {
  getCurrentUser,
};
