import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { UserRole } from "../../../generated/prisma/enums";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.createBooking({
      studentId: req.user?.id as string,
      slotId: req.body.slotId,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during createBooking",
    });
  }
};

const getMyBookings = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.getMyBookings(
      req.user?.id as string,
      req.user?.role as UserRole,
    );

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
          : "An unexpected error occurred during getMyBookings",
    });
  }
};

const getBookingDetails = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.getBookingById(req.params.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: "Booking not found",
    });
  }
};

const markCompleted = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.markBookingCompleted(
      req.params.id as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to mark booking as completed",
    });
  }
};

const cancelBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.cancelBooking(req.params.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to cancel booking",
    });
  }
};

export const BookingController = {
  createBooking,
  getMyBookings,
  getBookingDetails,
  markCompleted,
  cancelBooking,
};
