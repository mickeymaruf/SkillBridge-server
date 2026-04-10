import { google } from "@ai-sdk/google";
import { BookingStatus } from "../../../generated/prisma/enums";
import { TutorProfileWhereInput } from "../../../generated/prisma/models";
import { AppError } from "../../lib/AppError";
import { prisma } from "../../lib/prisma";
import { TutorUtils } from "./tutor.utils";
import { embed } from "ai";

interface TutorFilters {
  name?: string;
  category?: string;
  rating?: number;
  priceMin?: number;
  priceMax?: number;
  isFeatured?: boolean | undefined;
}

export async function getMyStats(userId: string) {
  const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
    where: { userId },
    select: { id: true, hourlyRate: true },
  });

  const tutorProfileId = tutorProfile.id;

  const [totalSlots, bookedSlots, upcomingSessions, completedSessions] =
    await prisma.$transaction([
      // 1. total slots
      prisma.availability.count({ where: { tutorProfileId } }),

      // 2. booked slots
      prisma.availability.count({
        where: { tutorProfileId, isBooked: true },
      }),

      // 3. upcoming sessions
      prisma.booking.count({
        where: { tutorProfileId, status: BookingStatus.CONFIRMED },
      }),

      // 4. completed sessions
      prisma.booking.count({
        where: { tutorProfileId, status: BookingStatus.COMPLETED },
      }),
    ]);

  return {
    totalSlots,
    bookedSlots,
    upcomingSessions,
    completedSessions,
    totalEarnings: completedSessions * tutorProfile.hourlyRate,
  };
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
      _count: {
        select: {
          availability: {
            where: {
              isBooked: false,
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

const getRelatedTutors = async (tutorId: string) => {
  // 1. Get the categories of the current tutor
  const currentTutor = await prisma.tutorProfile.findUniqueOrThrow({
    where: { id: tutorId },
    select: {
      categories: {
        select: { categoryId: true },
      },
    },
  });

  const categoryIds = currentTutor.categories.map((c) => c.categoryId);

  // 2. Find other tutors with these categories
  return await prisma.tutorProfile.findMany({
    where: {
      id: { not: tutorId }, // Exclude current tutor
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    },
    take: 3, // Limit to 3 for the UI
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      rating: "desc",
    },
  });
};

const logUserActivity = async (
  userId: string,
  type: "SEARCH" | "VIEW_TUTOR",
  content: string,
) => {
  return await prisma.userActivity.create({
    data: {
      userId,
      type,
      content,
    },
  });
};

export const getRecommendedMentors = async (userId: string) => {
  // 1. Get the last 5 activities to understand user intent
  const activities = await prisma.userActivity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Fallback if user has no activity yet
  if (activities.length === 0) {
    return await prisma.tutorProfile.findMany({
      take: 3,
      where: { isFeatured: true }, // or just latest
      include: { user: { select: { name: true, image: true } } },
    });
  }

  // 2. Combine activities into one string for the AI
  const activitySummary = activities.map((a) => a.content).join(" ");

  // 3. Generate the "User Interest Vector"
  const { embedding } = await embed({
    model: google.embeddingModel("gemini-embedding-001"),
    value: activitySummary,
    providerOptions: {
      google: {
        outputDimensionality: 768,
      },
    },
  });

  const vectorString = `[${embedding.join(",")}]`;

  // 4. Find tutors using Vector Similarity Search (<=> operator)
  // We use $queryRaw to perform the math in the database
  const recommendedTutors = await prisma.$queryRaw`
    SELECT 
      tp.id, 
      tp."userId", 
      tp.bio, 
      tp."hourlyRate", 
      u.name as "userName", 
      u.image as "userImage",
      (tp.embedding <=> ${vectorString}::vector) as distance
    FROM tutor_profiles tp
    JOIN "user" u ON tp."userId" = u.id
    ORDER BY distance ASC
    LIMIT 3
  `;

  return recommendedTutors;
};

const getTutorById = async (id: string) => {
  return await prisma.tutorProfile.findUniqueOrThrow({
    where: { id },
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      availability: {
        where: { isBooked: false },
      },
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
    orderBy: { createdAt: "desc" },
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
  return await prisma.$transaction(async (tx) => {
    // Update the profile
    const profile = await tx.tutorProfile.update({
      where: { userId },
      data: {
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        user: { update: { name: data.name } },
      },
    });

    // Sync AI Embedding
    await TutorUtils.syncTutorEmbedding(tx, profile.id);

    return profile;
  });
};

const setCategories = async (userId: string, categoryIds: string[]) => {
  return await prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    });

    // Remove old categories
    await tx.tutorCategory.deleteMany({
      where: { tutorProfileId: tutorProfile.id },
    });

    // Add new ones
    await tx.tutorCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        tutorProfileId: tutorProfile.id,
        categoryId,
      })),
    });

    // RE-SYNC AI: Now that categories are updated, update the vector
    await TutorUtils.syncTutorEmbedding(tx, tutorProfile.id);

    return { success: true };
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
    throw new AppError("Invalid date format", 400);
  }

  if (start.getTime() <= now.getTime()) {
    throw new AppError("You cannot book a time in the past", 400);
  }

  if (start.getTime() >= end.getTime()) {
    throw new AppError("startTime must be before endTime", 400);
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
      throw new AppError(
        "This time slot overlaps with an existing availability",
        409,
      );
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
  getMyStats,
  getAllTutors,
  getRelatedTutors,
  getRecommendedMentors,
  logUserActivity,
  getTutorById,
  getMyProfile,
  createProfile,
  updateProfile,
  createAvailability,
  setCategories,
  getTutorAvailability,
  getTutorBookings,
};
