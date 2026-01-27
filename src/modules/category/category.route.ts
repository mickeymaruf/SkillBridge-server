import express from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/", CategoryController.getAllCategories);
router.get("/:slug", CategoryController.getCategoryBySlug);
router.post(
  "/",
  // auth(UserRole.ADMIN),
  CategoryController.createCategory,
);
router.patch(
  "/:id",
  // auth(UserRole.ADMIN),
  CategoryController.updateCategory,
);
router.delete(
  "/:id",
  // auth(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRouter = router;
