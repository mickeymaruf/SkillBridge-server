import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

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
    const { tutorProfileId } = booking;

    if (booking.studentId !== studentId) {
      throw new Error("Unauthorized review attempt");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new Error("Booking must be completed before review");
    }

    await tx.review.create({
      data: { studentId, ...data, tutorProfileId },
    });
    await tx.review.create({
      data: { studentId, ...data, tutorProfileId },
    });

    // get (avg, count) reviews by review.aggregate
    const stats = await tx.review.aggregate({
      where: { tutorProfileId },
      _avg: { rating: true },
      _count: true,
    });

    // then update tutorProfile with latest avg and count
    await prisma.tutorProfile.update({
      where: { id: tutorProfileId },
      data: {
        rating: stats._avg.rating ?? 0,
        reviewCount: stats._count,
      },
    });
  });
};

export const ReviewService = {
  getReviewsByTutor,
  createReview,
};
