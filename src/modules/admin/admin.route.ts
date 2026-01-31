import express from "express";
import { AdminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get(
  "/get-all-bookings",
  auth(UserRole.ADMIN),
  AdminController.getAllBookings,
);
router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.get("/users/:id", auth(UserRole.ADMIN), AdminController.getUser);
router.patch(
  "/users/:id/status",
  auth(UserRole.ADMIN),
  AdminController.updateUserStatus,
);

export const AdminRouter = router;
