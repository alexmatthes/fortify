-- DropForeignKey
ALTER TABLE "Rudiment" DROP CONSTRAINT "Rudiment_userId_fkey";

-- AlterTable
ALTER TABLE "Rudiment" ADD COLUMN     "isStandard" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rudiment" ADD CONSTRAINT "Rudiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
