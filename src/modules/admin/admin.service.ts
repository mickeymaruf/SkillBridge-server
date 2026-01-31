import { prisma } from "../../lib/prisma";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";

const getAnalytics = async () => {
  return await prisma.$transaction(async (tx) => {
    const userCount = await tx.user.count();
    const tutorCount = await tx.tutorProfile.count();
    const studentCount = await tx.user.count({
      where: { role: UserRole.STUDENT },
    });
    const adminCount = await tx.user.count({
      where: { role: UserRole.ADMIN },
    });
    const bannerUserCount = await tx.user.count({
      where: { status: UserStatus.BANNED },
    });
    const unverifiedUserCount = await tx.user.count({
      where: { emailVerified: false },
    });
    const bookingCount = await tx.booking.count();
    const categoryCount = await tx.category.count();
    const reviewCount = await tx.review.count();

    return {
      userCount,
      tutorCount,
      studentCount,
      adminCount,
      bookingCount,
      bannerUserCount,
      unverifiedUserCount,
      categoryCount,
      reviewCount,
    };
  });
};

const getAllBookings = async () => {
  return await prisma.booking.findMany({
    select: {
      id: true,
      status: true,
      createdAt: true,

      slot: {
        select: {
          startTime: true,
          endTime: true,
          isBooked: true,
        },
      },

      tutorProfile: {
        select: {
          hourlyRate: true,
          isFeatured: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },

      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: { createdAt: "desc" },
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: {
      tutorProfiles: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      tutorProfiles: true,
    },
  });
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  return await prisma.user.update({
    where: { id },
    data: { status },
  });
};

export const AdminService = {
  getAnalytics,
  getAllBookings,
  getAllUsers,
  getUserById,
  updateUserStatus,
};
