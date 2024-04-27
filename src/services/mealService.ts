import { $Enums, PrismaClient, ServingUnit } from "@prisma/client";
import { UserNotFound } from "../exceptions/UserNotFound";
import { calcNutritionForItem, calcNutritionForMeal } from "./nutritionService";
import { MealNotFound } from "../exceptions/MealNotFound";
import { MealNotBelongToUser } from "../exceptions/MealNotBelongToUser";
import { getUnitByAbbrev } from "./unitService";
import { UnitNotFound } from "../exceptions/UnitNotFound";

const prisma = new PrismaClient();

export function isMealName(name: string) {
  return (Object.values($Enums.MealType) as string[]).includes(name);
}

export async function createMeal(
  username: string,
  name: $Enums.MealType,
  date: string
) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) throw new UserNotFound();
  return await prisma.meal.create({
    data: {
      name,
      mealDate: date,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
}

export async function addFoodToMeal(
  mealId: string,
  foodId: string,
  amount: number,
  unitAbbrev: string
) {
  const unit = await getUnitByAbbrev(unitAbbrev);
  if (!unit) throw new UnitNotFound();
  return await prisma.mealItem.create({
    data: {
      amount,
      unit: {
        connect: {
          id: unit.id,
        },
      },
      meal: {
        connect: {
          id: mealId,
        },
      },
      food: {
        connect: {
          id: foodId,
        },
      },
    },
  });
}

export async function getMealItemById(mealItemId: string) {
  return await prisma.mealItem.findUnique({
    where: {
      id: mealItemId,
    },
    include: {
      meal: {
        include: { user: true },
      },
      food: true,
      unit: true,
    },
  });
}

export async function checkMealItemOwnership(
  username: string,
  mealItemId: string
) {
  const realUsername = (await getMealItemById(mealItemId)).meal.user.username;
  if (realUsername !== username) throw new MealNotBelongToUser();
}

export async function deleteMealItem(username: string, mealItemId: string) {
  await checkMealItemOwnership(username, mealItemId);
  return await prisma.mealItem.delete({
    where: {
      id: mealItemId,
    },
  });
}

export async function updateMealItem(
  username: string,
  mealItemId: string,
  amount: number,
  unitAbbrev: string
) {
  await checkMealItemOwnership(username, mealItemId);
  const unit = await getUnitByAbbrev(unitAbbrev);
  if (!unit) throw new UnitNotFound();
  return await prisma.mealItem.update({
    where: {
      id: mealItemId,
    },
    data: {
      amount,
      unit: {
        connect: {
          id: unit.id,
        },
      },
    },
  });
}

export async function getMealById(mealId: string) {
  const meal = await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
    include: {
      items: {
        include: {
          food: true,
          unit: true,
        },
      },
    },
  });
  if (!meal) throw new MealNotFound();
  return await makeMealWithNutrition(meal);
}

async function makeMealWithNutrition(meal) {
  return {
    id: meal.id,
    name: meal.name,
    totalNutrition: await calcNutritionForMeal(meal),
    date: meal.mealDate,
    items: await Promise.all(
      meal.items.map(async (item) => {
        return {
          nutrition: await calcNutritionForItem(item),
          id: item.id,
          amount: item.amount,
          unit: item.unit,
          food: item.food,
        };
      })
    ),
  };
}

export async function getMealsForDay(username: string, date: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) throw new UserNotFound();

  const rawResult = await prisma.meal.findMany({
    where: {
      userId: user.id,
      mealDate: date,
    },
    include: {
      items: {
        include: {
          food: true,
          unit: true,
        },
      },
    },
  });

  return await Promise.all(rawResult.map(makeMealWithNutrition));
}
