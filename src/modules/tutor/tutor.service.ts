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
      availability: true,
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

const createAvailability = async (
  userId: string,
  { startTime, endTime }: { startTime: string | Date; endTime: string | Date },
) => {
  const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId },
    select: { id: true },
  });

  if (startTime >= endTime) {
    throw new Error("startTime must be before endTime");
  }

  return prisma.$transaction(async (tx) => {
    const conflict = await tx.availability.findFirst({
      where: {
        tutorProfileId: tutorProfile.id,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (conflict) {
      throw new Error("This time slot overlaps with an existing availability");
    }

    return tx.availability.create({
      data: {
        tutorProfileId: tutorProfile.id,
        startTime,
        endTime,
      },
    });
  });
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  createProfile,
  updateProfile,
  createAvailability,
};
