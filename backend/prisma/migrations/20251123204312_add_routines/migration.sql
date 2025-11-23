-- DropForeignKey
ALTER TABLE "Rudiment" DROP CONSTRAINT "Rudiment_userId_fkey";

-- AlterTable
ALTER TABLE "Rudiment" ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'Beginner',
ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "tempoIncrement" SET DEFAULT 2;

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineItem" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "routineId" TEXT NOT NULL,
    "rudimentId" TEXT NOT NULL,

    CONSTRAINT "RoutineItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rudiment" ADD CONSTRAINT "Rudiment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Rudiment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rudiment" ADD CONSTRAINT "Rudiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineItem" ADD CONSTRAINT "RoutineItem_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineItem" ADD CONSTRAINT "RoutineItem_rudimentId_fkey" FOREIGN KEY ("rudimentId") REFERENCES "Rudiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
