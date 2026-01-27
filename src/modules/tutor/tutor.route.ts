import express from "express";
import { TutorController } from "./tutor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/", TutorController.getAllTutors);
router.get("/:tutorId", TutorController.getTutorById);
router.post("/profile", auth(UserRole.TUTOR), TutorController.createProfile);
router.patch("/profile", auth(UserRole.TUTOR), TutorController.updateProfile);
router.put(
  "/availability",
  auth(UserRole.TUTOR),
  TutorController.createAvailability,
);

export const TutorRouter = router;
