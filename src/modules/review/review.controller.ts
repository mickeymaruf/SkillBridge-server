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

export const ReviewController = {
  createReview,
};
