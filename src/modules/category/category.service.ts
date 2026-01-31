import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getCategoryBySlug = async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
  });
};

const createCategory = async (data: { name: string; slug: string }) => {
  return await prisma.category.create({
    data,
  });
};

const updateCategory = async (
  id: string,
  data: { name?: string; slug?: string },
) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
