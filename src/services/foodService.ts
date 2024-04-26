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
  params: {
    sortBy?: SortCriteria;
    sortOrder?: SortOrder;
    limit?: number;
    offset?: number;
    filters?: object;
  } = {
    sortBy: "calories",
    sortOrder: "desc",
    limit: 10,
    offset: 0,
    filters: {},
  }
) {
  // in case the function is called with arguments as undefined
  if (params.sortBy === undefined) {
    params.sortBy = "calories";
  }
  if (params.sortOrder === undefined) {
    params.sortOrder = "desc";
  }
  if (params.limit === undefined) {
    params.limit = 10;
  }
  if (params.offset === undefined) {
    params.offset = 0;
  }
  if (params.filters === undefined || params.filters === null) {
    params.filters = {};
  }
  return await prisma.food.findMany({
    where: params.filters,
    orderBy: {
      [params.sortBy]: params.sortOrder,
    },
    take: params.limit,
    skip: params.offset,
  });
}

export async function getFoodByName(name: string) {
  return await getFood({
    filters: { name: { contains: name, mode: "insensitive" } },
  });
}
