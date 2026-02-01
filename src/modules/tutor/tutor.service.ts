import { TutorProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

interface TutorFilters {
  name?: string;
  category?: string;
  rating?: number;
  priceMin?: number;
  priceMax?: number;
  isFeatured?: boolean | undefined;
}

const getAllTutors = async ({
  name,
  category,
  rating,
  priceMin,
  priceMax,
  isFeatured,
}: TutorFilters) => {
  const filters: TutorProfileWhereInput[] = [];

  if (category) {
    filters.push({
      categories: {
        some: {
          category: {
            slug: category,
          },
        },
      },
    });
  }

  if (priceMin) {
    filters.push({
      hourlyRate: {
        gte: Number(priceMin),
      },
    });
  }

  if (priceMax) {
    filters.push({
      hourlyRate: {
        lte: Number(priceMax),
      },
    });
  }

  if (rating) {
    filters.push({
      rating: {
        gte: Number(rating),
      },
    });
  }

  if (isFeatured) {
    filters.push({ isFeatured });
  }

  if (name) {
    filters.push({
      OR: [
        {
          user: {
            name: { contains: name, mode: "insensitive" },
          },
        },
      ],
    });
  }

  return await prisma.tutorProfile.findMany({
    where: {
      AND: filters,
    },
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
    orderBy: {
      createdAt: "desc",
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
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              status: true,
            },
          },
        },
      },
    },
  });
};

const getMyProfile = async (id: string) => {
  return await prisma.tutorProfile.findUnique({
    where: { userId: id },
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      availability: true,
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              status: true,
            },
          },
        },
      },
    },
  });
};

const getTutorAvailability = async (id: string) => {
  return await prisma.availability.findMany({
    where: { tutorProfile: { userId: id }, isBooked: false },
  });
};

const getTutorBookings = async (id: string) => {
  return await prisma.booking.findMany({
    where: { tutorProfile: { userId: id } },
    include: { student: true, slot: true },
  });
};

const createProfile = async (userId: string) => {
  return await prisma.tutorProfile.create({
    data: { userId },
  });
};

const updateProfile = async (
  userId: string,
  data: {
    name: string;
    bio: string | null;
    hourlyRate: number;
  },
) => {
  return await prisma.tutorProfile.update({
    where: {
      userId,
    },
    data: {
      bio: data.bio,
      hourlyRate: data.hourlyRate,
      user: {
        update: {
          name: data.name,
        },
      },
    },
  });
};

const setCategories = async (userId: string, categoryIds: string[]) => {
  return await prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.findUniqueOrThrow({
      where: { userId },
      select: {
        id: true,
      },
    });

    await tx.tutorCategory.deleteMany({
      where: { tutorProfileId: tutorProfile.id },
    });

    return await tx.tutorCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        tutorProfileId: tutorProfile.id,
        categoryId,
      })),
    });
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

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }

  if (start.getTime() <= now.getTime()) {
    throw new Error("You cannot book a time in the past");
  }

  if (start.getTime() >= end.getTime()) {
    throw new Error("startTime must be before endTime");
  }

  return prisma.$transaction(async (tx) => {
    const conflict = await tx.availability.findFirst({
      where: {
        tutorProfileId: tutorProfile.id,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflict) {
      throw new Error("This time slot overlaps with an existing availability");
    }

    return tx.availability.create({
      data: {
        tutorProfileId: tutorProfile.id,
        startTime: start,
        endTime: end,
      },
    });
  });
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  getMyProfile,
  createProfile,
  updateProfile,
  createAvailability,
  setCategories,
  getTutorAvailability,
  getTutorBookings,
};
