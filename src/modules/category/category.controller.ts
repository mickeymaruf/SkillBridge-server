import { Request, Response } from "express";
import { CategoryService } from "./category.service";

const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during getAllCategories",
    });
  }
};

const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await CategoryService.getCategoryBySlug(slug as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during getCategoryBySlug",
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during createCategory",
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.updateCategory(id as string, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during updateCategory",
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.deleteCategory(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred during deleteCategory",
    });
  }
};

export const CategoryController = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
