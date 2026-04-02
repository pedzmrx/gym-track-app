/*
  Warnings:

  - You are about to drop the column `name` on the `WorkoutExercise` table. All the data in the column will be lost.
  - Added the required column `exerciseId` to the `WorkoutExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutExercise" DROP COLUMN "name",
ADD COLUMN     "exerciseId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
