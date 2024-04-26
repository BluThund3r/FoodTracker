import { UserDetails } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import { UserNotFound } from "../exceptions/UserNotFound";
import { getUserByUsername, getUserDetailsByUsername } from "./userService";
import { getMealsForDay } from "./mealService";

const activityMapping = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  SUPER_ACTIVE: 1.9,
};

const planMapping = {
  MAINTENANCE: 0,
  WEIGHT_LOSS: -500,
  WEIGHT_GAIN: 500,
};

const caloriesPerMacros = {
  protein: 4,
  carbs: 4,
  fat: 9,
  sugar: 4,
};

const macrosPercent = {
  protein: 0.17,
  fat: 0.25,
  carbs: 0.58,
  sugar: 0.1,
};

export async function getMetricsForUser(username: string) {
  const userDetails = await getUserDetailsByUsername(username);
  return {
    BMR: calculateBMR(userDetails),
    TDEE: calculateTDEE(userDetails),
  };
}

export function calculateBMR(userDetails: UserDetails) {
  const { weight, height, age, gender } = userDetails;
  if (gender === "M") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(userDetails: UserDetails) {
  return calculateBMR(userDetails) * activityMapping[userDetails.activityLevel];
}

export async function getCaloriesForUserByPlan(username: string) {
  const userDetails = await getUserDetailsByUsername(username);
  return calculateTDEE(userDetails) + planMapping[userDetails.plan];
}

function calculateMacros(calories: number) {
  const proteinCalories = macrosPercent.protein * calories;
  const fatCalories = macrosPercent.fat * calories;
  const carbCalories = macrosPercent.carbs * calories;
  const sugarCalories = macrosPercent.sugar * calories;
  return {
    protein: proteinCalories / caloriesPerMacros.protein,
    fat: fatCalories / caloriesPerMacros.fat,
    carbs: carbCalories / caloriesPerMacros.carbs,
    sugar: sugarCalories / caloriesPerMacros.sugar,
  };
}

export async function getUserIdealNutrition(username: string) {
  const calories = await getCaloriesForUserByPlan(username);
  return {
    calories,
    macros: calculateMacros(calories),
  };
}

export async function getUserNutritionForDay(username: string, date: string) {
  const mealsForDate = await getMealsForDay(username, date);
  return mealsForDate.reduce(
    (acc, meal) => {
      acc.calories += meal.totalNutrition.calories;
      acc.protein += meal.totalNutrition.protein;
      acc.carbs += meal.totalNutrition.carbs;
      acc.fat += meal.totalNutrition.fat;
      acc.sugar += meal.totalNutrition.sugar;
      return acc;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      sugar: 0,
    }
  );
}

export async function getUserNutritionRemainingForDay(
  username: string,
  date: string
) {
  const idealNutrition = await getUserIdealNutrition(username);
  const nutritionForDay = await getUserNutritionForDay(username, date);
  return {
    calories: idealNutrition.calories - nutritionForDay.calories,
    protein: idealNutrition.macros.protein - nutritionForDay.protein,
    carbs: idealNutrition.macros.carbs - nutritionForDay.carbs,
    fat: idealNutrition.macros.fat - nutritionForDay.fat,
    sugar: idealNutrition.macros.sugar - nutritionForDay.sugar,
  };
}
