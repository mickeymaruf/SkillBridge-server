import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { UserStatus } from "../../../generated/prisma/enums";

const getAnalytics = async (_req: Request, res: Response) => {
  try {
    const result = await AdminService.getAnalytics();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while get analytics",
    });
  }
};

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

const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllBookings();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while get-all-bookings",
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

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    if (!Object.values(UserStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user status type",
      });
    }

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
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while updating user status",
    });
  }
};

export const AdminController = {
  getAnalytics,
  getAllBookings,
  getAllUsers,
  getUser,
  updateUserStatus,
};
