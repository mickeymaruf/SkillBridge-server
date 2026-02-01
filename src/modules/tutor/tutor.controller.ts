import { Request, Response } from "express";
import { TutorService } from "./tutor.service";

const getMyStats = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.getMyStats(req.user?.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while get analytics",
    });
  }
};

const getAllTutors = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during getAllTutors",
    });
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.getTutorById(
      req.params.tutorId as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during getTutorById",
    });
  }
};

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.getMyProfile(req.user?.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during getTutorById",
    });
  }
};

const getTutorAvailability = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.getTutorAvailability(
      req.user?.id as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during getTutorAvailability",
    });
  }
};

const getTutorBookings = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.getTutorBookings(req.user?.id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during getTutorBookings",
    });
  }
};

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.createProfile(req.user?.id as string);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during createProfile",
    });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await TutorService.updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during updateProfile",
    });
  }
};

const setCategories = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during setCategories",
    });
  }
};

const createAvailability = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await TutorService.createAvailability(userId, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during createAvailability",
    });
  }
};

export const TutorController = {
  getMyStats,
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
