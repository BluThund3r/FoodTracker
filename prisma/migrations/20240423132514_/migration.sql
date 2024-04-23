/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,mealDate]` on the table `Meal` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `Meal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS');

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "mealDate" date NOT NULL DEFAULT now(),
DROP COLUMN "name",
ADD COLUMN     "name" "MealType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Meal_userId_name_mealDate_key" ON "Meal"("userId", "name", "mealDate");
