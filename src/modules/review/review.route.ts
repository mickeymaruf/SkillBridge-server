import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/:tutorProfileId", ReviewController.getTutorReviews);
router.post("/", auth(UserRole.STUDENT), ReviewController.createReview);

export const ReviewRouter = router;
