import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createReview = async (
  studentId: string,
  data: {
    bookingId: string;
    rating: number;
    review: string;
  },
) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: { id: data.bookingId },
      include: { tutorProfile: true },
    });

    if (booking.studentId !== studentId) {
      throw new Error("Unauthorized review attempt");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new Error("Booking must be completed before review");
    }

    return await tx.review.create({
      data: { studentId, ...data, tutorProfileId: booking.tutorProfileId },
    });
  });
};

const getReviewsByTutor = async (tutorProfileId: string) => {
  return await prisma.review.findMany({
    where: { tutorProfileId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const ReviewService = {
  createReview,
  getReviewsByTutor,
};
