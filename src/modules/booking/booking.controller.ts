import { NextFunction, Request, Response } from "express";
import { BookingService } from "./booking.service";
import { BookingStatus, UserRole } from "../../../generated/prisma/enums";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookingService.createBooking({
      studentId: req.user?.id as string,
      slotId: req.body.slotId,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status } = req.query;

    let statuses;
    if (typeof status === "string") {
      statuses = [status];
    } else if (Array.isArray(status)) {
      statuses = status;
    }

    const result = await BookingService.getMyBookings(
      req.user?.id as string,
      req.user?.role as UserRole,
      statuses as BookingStatus[],
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getBookingDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookingService.getBookingById(req.params.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const markCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookingService.markBookingCompleted(
      req.params.id as string,
      req.user?.id as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookingService.cancelBooking(req.params.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export const BookingController = {
  createBooking,
  getMyBookings,
  getBookingDetails,
  markCompleted,
  cancelBooking,
};
