/*
  Warnings:

  - Added the required column `quality` to the `PracticeSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rudiment" DROP CONSTRAINT "Rudiment_userId_fkey";

-- AlterTable
ALTER TABLE "PracticeSession" ADD COLUMN     "quality" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Rudiment" ALTER COLUMN "tempoIncrement" SET DEFAULT 5;

-- AddForeignKey
ALTER TABLE "Rudiment" ADD CONSTRAINT "Rudiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
