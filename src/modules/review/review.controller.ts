import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./review.service";

const getTutorReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ReviewService.getReviewsByTutor(
      req.params.tutorProfileId as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ReviewService.createReview(
      req.user?.id as string,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export const ReviewController = {
  getTutorReviews,
  createReview,
};
