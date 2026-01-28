import express from "express";
import { AdminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.get("/:id", auth(UserRole.ADMIN), AdminController.getUser);
router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  AdminController.updateUserStatus,
);

export const AdminRouter = router;
