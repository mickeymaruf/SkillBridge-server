import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserService.getCurrentUser(req);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export const UserController = {
  getCurrentUser,
};
