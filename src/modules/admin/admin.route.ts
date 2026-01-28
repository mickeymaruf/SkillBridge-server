import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllUsers);
router.get("/:id", AdminController.getUser);
router.patch("/:id/status", AdminController.updateUserStatus);

export const AdminRouter = router;
