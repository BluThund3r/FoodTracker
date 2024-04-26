/*
  Warnings:

  - You are about to drop the column `carbohydrates` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `sugars` on the `Food` table. All the data in the column will be lost.
  - You are about to alter the column `mealDate` on the `Meal` table. The data in that column could be lost. The data in that column will be cast from `Date` to `Unsupported("date")`.
  - Added the required column `carbs` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sugar` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "carbohydrates",
DROP COLUMN "sugars",
ADD COLUMN     "carbs" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sugar" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "mealDate" SET DEFAULT now(),
ALTER COLUMN "mealDate" SET DATA TYPE date;
