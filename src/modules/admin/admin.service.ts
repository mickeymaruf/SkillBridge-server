import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/enums";

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
  getAllBookings,
  getAllUsers,
  getUserById,
  updateUserStatus,
};
