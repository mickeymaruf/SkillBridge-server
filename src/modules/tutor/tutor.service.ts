import { prisma } from "../../lib/prisma";

const getAllTutors = async () => {
  return await prisma.tutorProfile.findMany({
    include: {
      user: true,
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

const getTutorById = async (id: string) => {
  return await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
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
    categories: string[];
  },
) => {
  return await prisma.tutorProfile.update({
    where: {
      userId,
    },
    data: {
      categories: data.categories && {
        create: data.categories.map((categoryId) => ({ categoryId })),
      },
    },
  });
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  createProfile,
  updateProfile,
};
