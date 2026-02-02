import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;
    const result = await CategoryService.getCategoryBySlug(slug as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.updateCategory(id as string, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.deleteCategory(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export const CategoryController = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
