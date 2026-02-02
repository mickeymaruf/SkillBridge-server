import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { UserStatus } from "../../../generated/prisma/enums";

const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AdminService.getAnalytics();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getAllUsers();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AdminService.getAllBookings();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getUserById(req.params.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
  } catch (e) {
    next(e);
  }
};

export const AdminController = {
  getAnalytics,
  getAllBookings,
  getAllUsers,
  getUser,
  updateUserStatus,
};
