/*
  Warnings:

  - You are about to drop the column `servingUnitId` on the `Food` table. All the data in the column will be lost.
  - You are about to alter the column `mealDate` on the `Meal` table. The data in that column could be lost. The data in that column will be cast from `Date` to `Unsupported("date")`.
  - A unique constraint covering the columns `[name]` on the table `ServingUnit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[abbreviation]` on the table `ServingUnit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseServingUnitId` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_servingUnitId_fkey";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "servingUnitId",
ADD COLUMN     "baseServingUnitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "mealDate" SET DEFAULT now(),
ALTER COLUMN "mealDate" SET DATA TYPE date;

-- CreateIndex
CREATE UNIQUE INDEX "ServingUnit_name_key" ON "ServingUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServingUnit_abbreviation_key" ON "ServingUnit"("abbreviation");

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_baseServingUnitId_fkey" FOREIGN KEY ("baseServingUnitId") REFERENCES "ServingUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
