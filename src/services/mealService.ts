import { $Enums, Meal, PrismaClient, ServingUnit } from "@prisma/client";
import { UserNotFound } from "../exceptions/UserNotFound";
import { convert } from "./unitService";

const prisma = new PrismaClient();

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
  unit: ServingUnit
) {
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

export async function deleteMealItem(mealItemId: string) {
  return await prisma.mealItem.delete({
    where: {
      id: mealItemId,
    },
  });
}

export async function updateMealItem(
  mealItemId: string,
  amount: number,
  unit: ServingUnit
) {
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

async function calcNutritionForItem(item) {
  const ratio =
    (await convert(item.unit.id, item.food.baseServingUnit.id, item.amount)) /
    item.food.baseServingSize;
  return {
    calories: item.food.calories * ratio,
    protein: item.food.protein * ratio,
    carbs: item.food.carbs * ratio,
    fat: item.food.fat * ratio,
    sugar: item.food.sugar * ratio,
  };
}

async function calcTotalNutrition(meal) {
  let result = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
  };

  for (const item of meal.items) {
    const { calories, protein, fat, carbs, sugar } = await calcNutritionForItem(
      item
    );
    result.calories += calories;
    result.protein += protein;
    result.carbs += carbs;
    result.fat += fat;
    result.sugar += sugar;
  }

  return result;
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

  return await Promise.all(
    rawResult.map(async (meal) => {
      return {
        id: meal.id,
        name: meal.name,
        totalNutrition: await calcTotalNutrition(meal),
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
    })
  );
}
