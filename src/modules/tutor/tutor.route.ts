import express from "express";
import { TutorController } from "./tutor.controller";
import auth, { optionalAuth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/profile/stats", auth(UserRole.TUTOR), TutorController.getMyStats);
router.get("/", optionalAuth, TutorController.getAllTutors);
router.post("/ai-search", TutorController.parseAiSearch);
router.get("/:tutorId", optionalAuth, TutorController.getTutorById);
router.get("/:tutorId/related", TutorController.getRelatedTutors);
router.get(
  "/recommendations/me",
  auth(UserRole.STUDENT, UserRole.TUTOR),
  TutorController.getRecommendations,
);
router.get("/profile/me", auth(UserRole.TUTOR), TutorController.getMyProfile);
router.get(
  "/profile/availability",
  auth(UserRole.TUTOR),
  TutorController.getTutorAvailability,
);
router.get(
  "/profile/bookings",
  auth(UserRole.TUTOR),
  TutorController.getTutorBookings,
);
router.post("/profile", auth(UserRole.TUTOR), TutorController.createProfile);
router.patch("/profile", auth(UserRole.TUTOR), TutorController.updateProfile);
router.put(
  "/profile/set-categories",
  auth(UserRole.TUTOR),
  TutorController.setCategories,
);
router.put(
  "/availability",
  auth(UserRole.TUTOR),
  TutorController.createAvailability,
);

export const TutorRouter = router;
