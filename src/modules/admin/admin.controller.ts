import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllUsers();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getUserById(req.params.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: "User not found",
    });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const result = await AdminService.updateUserStatus(
      req.params.id as string,
      status as UserStatus,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to update user status",
    });
  }
};

export const AdminController = {
  getAllUsers,
  getUser,
  updateUserStatus,
};
