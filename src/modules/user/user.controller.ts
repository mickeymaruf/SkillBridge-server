import { Request, Response } from "express";
import { UserService } from "./user.service";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getCurrentUser(req);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during getCurrentUser",
    });
  }
};

export const UserController = {
  getCurrentUser,
};
