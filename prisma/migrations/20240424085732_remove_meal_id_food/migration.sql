/*
  Warnings:

  - You are about to drop the column `mealId` on the `Food` table. All the data in the column will be lost.
  - You are about to alter the column `mealDate` on the `Meal` table. The data in that column could be lost. The data in that column will be cast from `Date` to `Unsupported("date")`.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "mealId";

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "mealDate" SET DEFAULT now(),
ALTER COLUMN "mealDate" SET DATA TYPE date;
