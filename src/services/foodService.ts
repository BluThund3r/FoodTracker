import { Food, PrismaClient } from "@prisma/client";
import { SortCriteria, SortOrder } from "../types/foodTypes";

const prisma = new PrismaClient();

export async function createFood(food: Partial<Food>) {
  return await prisma.food.create({
    data: {
      name: food.name,
      baseServingSize: food.baseServingSize,
      baseServingUnitId: food.baseServingUnitId,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      sugar: food.sugar,
    },
  });
}

export async function getFoodById(id: string) {
  return await prisma.food.findUnique({
    where: {
      id,
    },
  });
}

export async function getAllFood() {
  return await prisma.food.findMany();
}

export async function updateFood(id: string, food: Partial<Food>) {
  return await prisma.food.update({
    where: {
      id,
    },
    data: {
      name: food.name,
      baseServingSize: food.baseServingSize,
      baseServingUnitId: food.baseServingUnitId,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      sugar: food.sugar,
    },
  });
}

export async function deleteFood(id: string) {
  return await prisma.food.delete({
    where: {
      id,
    },
  });
}

export async function getFood(
  sortBy: SortCriteria = "calories",
  sortOrder: SortOrder = "desc",
  limit: number = 10,
  offset: number = 0,
  filters: object = {}
) {
  // in case the function is called with arguments as undefined
  if (sortBy === undefined) {
    sortBy = "calories";
  }
  if (sortOrder === undefined) {
    sortOrder = "desc";
  }
  if (limit === undefined) {
    limit = 10;
  }
  if (offset === undefined) {
    offset = 0;
  }
  if (filters === undefined || filters === null) {
    filters = {};
  }
  return await prisma.food.findMany({
    where: filters,
    orderBy: {
      [sortBy]: sortOrder,
    },
    take: limit,
    skip: offset,
  });
}
