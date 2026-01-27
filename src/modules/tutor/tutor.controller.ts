import { Request, Response } from "express";
import { TutorService } from "./tutor.service";

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.getAllTutors();

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
          : "An unexpected error occurred during getAllTutors",
    });
  }
};

const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await TutorService.createProfile(userId, req.body);

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

export const TutorController = {
  getAllTutors,
  getTutorById,
  createProfile,
  updateProfile,
};
