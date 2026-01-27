import { prisma } from "../../lib/prisma";

const getAllTutors = async () => {
  return await prisma.tutorProfile.findMany();
};

const getTutorById = async (id: string) => {
  return await prisma.tutorProfile.findUnique({ where: { id } });
};

const createProfile = async (
  userId: string,
  data: {
    bio?: string;
    hourlyRate: number;
  },
) => {
  return await prisma.tutorProfile.create({
    data: {
      userId,
      ...data,
    },
  });
};

const updateProfile = async (
  userId: string,
  data: {
    bio?: string;
    hourlyRate: number;
  },
) => {
  return await prisma.tutorProfile.update({
    where: {
      userId,
    },
    data,
  });
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  createProfile,
  updateProfile,
};
