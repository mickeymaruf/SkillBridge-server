import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";

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
  getTutorById,
  getMyProfile,
  createProfile,
  updateProfile,
  createAvailability,
  setCategories,
  getTutorAvailability,
  getTutorBookings,
};
