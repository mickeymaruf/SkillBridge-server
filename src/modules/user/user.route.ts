import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/me", UserController.getCurrentUser);

export const UserRouter = router;
