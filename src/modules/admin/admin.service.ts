import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/enums";

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
  getAllUsers,
  getUserById,
  updateUserStatus,
};
