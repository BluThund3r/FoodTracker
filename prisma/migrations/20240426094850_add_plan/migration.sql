/*
  Warnings:

  - You are about to alter the column `mealDate` on the `Meal` table. The data in that column could be lost. The data in that column will be cast from `Date` to `Unsupported("date")`.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('MAINTENANCE', 'WEIGHT_LOSS', 'WEIGHT_GAIN');

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "mealDate" SET DEFAULT now(),
ALTER COLUMN "mealDate" SET DATA TYPE date;

-- AlterTable
ALTER TABLE "UserDetails" ADD COLUMN     "plan" "Plan";
