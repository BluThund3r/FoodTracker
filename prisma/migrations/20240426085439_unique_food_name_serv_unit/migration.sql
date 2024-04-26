/*
  Warnings:

  - You are about to alter the column `mealDate` on the `Meal` table. The data in that column could be lost. The data in that column will be cast from `Date` to `Unsupported("date")`.
  - A unique constraint covering the columns `[name,baseServingUnitId]` on the table `Food` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "mealDate" SET DEFAULT now(),
ALTER COLUMN "mealDate" SET DATA TYPE date;

-- CreateIndex
CREATE UNIQUE INDEX "Food_name_baseServingUnitId_key" ON "Food"("name", "baseServingUnitId");
