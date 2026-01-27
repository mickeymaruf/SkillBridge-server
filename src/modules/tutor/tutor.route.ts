import express from "express";
import { TutorController } from "./tutor.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", TutorController.getAllTutors);
router.get("/:tutorId", TutorController.getTutorById);
router.post("/profile", auth("TUTOR"), TutorController.createProfile);
router.patch("/profile", auth("TUTOR"), TutorController.updateProfile);

export const TutorRouter = router;
