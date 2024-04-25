/*
  Warnings:

  - You are about to alter the column `mealDate` on the `Meal` table. The data in that column could be lost. The data in that column will be cast from `Date` to `Unsupported("date")`.
  - You are about to drop the column `conversionFactor` on the `UnitConversion` table. All the data in the column will be lost.
  - Added the required column `ratio` to the `UnitConversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "mealDate" SET DEFAULT now(),
ALTER COLUMN "mealDate" SET DATA TYPE date;

-- AlterTable
ALTER TABLE "UnitConversion" DROP COLUMN "conversionFactor",
ADD COLUMN     "ratio" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "UserDetails" ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "activityLevel" DROP NOT NULL;
