import { Request, Response } from "express";
import { ReviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.createReview(
      req.user?.id as string,
      req.body,
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
          : "An unexpected error occurred during createReview",
    });
  }
};

const getTutorReviews = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getReviewsByTutor(
      req.params.tutorProfileId as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to fetch reviews",
    });
  }
};

export const ReviewController = {
  createReview,
  getTutorReviews,
};
