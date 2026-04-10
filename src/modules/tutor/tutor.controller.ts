import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { prisma } from "../../lib/prisma";

const getMyStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TutorService.getMyStats(req.user?.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAllTutors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, category, rating, max, min, isFeatured } = req.query;

    const result = await TutorService.getAllTutors({
      name: name as string,
      category: category as string,
      rating: Number(rating),
      priceMax: Number(max),
      priceMin: Number(min),
      isFeatured: isFeatured ? isFeatured === "true" : undefined,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export const parseAiSearch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { prompt } = req.body;

    const dbCategories = await prisma.category.findMany({
      select: { name: true, slug: true },
    });

    const categoryList = dbCategories
      .map((c) => `${c.name} (slug: ${c.slug})`)
      .join(", ");

    const { object } = await generateObject({
      model: google("gemini-3-flash-preview"),
      schema: z.object({
        name: z.string().optional(),
        category: z.string().optional(),
        rating: z.number().optional(),
        max: z.number().optional(),
        min: z.number().optional(),
        isFeatured: z.boolean().optional(),
      }),
      system: `You are a search query parser for a tutor marketplace. 
               
               VALID CATEGORIES: [${categoryList}]
               
               STRICT RULES:
               1. ONLY return fields explicitly mentioned. If not mentioned, omit the field entirely.
               2. DO NOT return 'rating: 0', 'max: 0', or 'isFeatured: false' unless specifically requested.
               3. Subject subjects (Art, Math, etc.) go in 'category' based on slugs, NOT in 'name'.
               4. 'name' is for human names only. Omit "teacher", "tutor", etc.
               5. If they say "cheap", set max to 30. If they say "top rated", set rating to 4.`,
      prompt,
    });

    res.status(200).json({ success: true, data: object });
  } catch (e) {
    next(e);
  }
};

const getRelatedTutors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.getRelatedTutors(
      req.params.tutorId as string,
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getTutorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.getTutorById(
      req.params.tutorId as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.getMyProfile(req.user?.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getTutorAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.getTutorAvailability(
      req.user?.id as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getTutorBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.getTutorBookings(req.user?.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.createProfile(req.user?.id as string);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const result = await TutorService.updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const setCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const result = await TutorService.setCategories(
      userId,
      req.body.categoryIds,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const createAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const result = await TutorService.createAvailability(userId, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export const TutorController = {
  getMyStats,
  getAllTutors,
  parseAiSearch,
  getRelatedTutors,
  getTutorById,
  getMyProfile,
  createProfile,
  updateProfile,
  createAvailability,
  setCategories,
  getTutorAvailability,
  getTutorBookings,
};
