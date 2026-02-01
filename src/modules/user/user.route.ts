import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/me", auth(), UserController.getCurrentUser);

export const UserRouter = router;
