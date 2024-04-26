/*
  Warnings:

  - You are about to alter the column `mealDate` on the `Meal` table. The data in that column could be lost. The data in that column will be cast from `Date` to `Unsupported("date")`.
  - You are about to drop the `_FoodToMeal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FoodToMeal" DROP CONSTRAINT "_FoodToMeal_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToMeal" DROP CONSTRAINT "_FoodToMeal_B_fkey";

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "mealDate" SET DEFAULT now(),
ALTER COLUMN "mealDate" SET DATA TYPE date;

-- DropTable
DROP TABLE "_FoodToMeal";

-- CreateTable
CREATE TABLE "MealItem" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "servingUnitId" TEXT NOT NULL,

    CONSTRAINT "MealItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_servingUnitId_fkey" FOREIGN KEY ("servingUnitId") REFERENCES "ServingUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
