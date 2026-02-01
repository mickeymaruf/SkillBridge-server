import { BookingStatus, UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createBooking = async (data: { studentId: string; slotId: string }) => {
  return await prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUniqueOrThrow({
      where: { id: data.slotId },
    });

    if (availability.isBooked) throw new Error("Slot already booked!");

    await tx.availability.update({
      where: { id: data.slotId },
      data: { isBooked: true },
    });

    return await tx.booking.create({
      data: { ...data, tutorProfileId: availability.tutorProfileId },
    });
  });
};

const getMyBookings = async (
  userId: string,
  role: string,
  statuses: BookingStatus[],
) => {
  return await prisma.booking.findMany({
    where: {
      ...(role === UserRole.STUDENT
        ? { studentId: userId }
        : { tutorProfile: { userId } }),
      status: { in: statuses },
    },

    include: {
      slot: true,
      tutorProfile: {
        include: {
          user: true,
        },
      },
      student: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getBookingById = async (id: string) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      slot: true,
      tutorProfile: true,
      student: true,
      review: true,
    },
  });
};

const markBookingCompleted = async (bookingId: string, userId: string) => {
  return await prisma.booking.update({
    where: { id: bookingId, tutorProfile: { userId } },
    data: { status: BookingStatus.COMPLETED },
  });
};

const cancelBooking = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });

    await tx.availability.update({
      where: { id: booking.slotId },
      data: { isBooked: false },
    });

    return booking;
  });
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  markBookingCompleted,
  cancelBooking,
};
