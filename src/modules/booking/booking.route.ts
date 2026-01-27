import express from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.STUDENT, UserRole.TUTOR),
  BookingController.getMyBookings,
);
router.post("/", auth(UserRole.STUDENT), BookingController.createBooking);
router.get(
  "/:id",
  auth(UserRole.STUDENT, UserRole.TUTOR),
  BookingController.getBookingDetails,
);
router.patch(
  "/:id/complete",
  auth(UserRole.TUTOR),
  BookingController.markCompleted,
);
router.patch(
  "/:id/cancel",
  auth(UserRole.STUDENT),
  BookingController.cancelBooking,
);

export const BookingRouter = router;
