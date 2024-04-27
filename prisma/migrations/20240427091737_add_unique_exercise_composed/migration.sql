/*
  Warnings:

  - A unique constraint covering the columns `[userId,date,exerciseId]` on the table `UserExercise` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserExercise_userId_date_exerciseId_key" ON "UserExercise"("userId", "date", "exerciseId");
