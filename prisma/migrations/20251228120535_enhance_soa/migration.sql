/*
  Warnings:

  - You are about to drop the column `efektivitas` on the `SOA` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "SOAStatus" ADD VALUE 'DIHENTIKAN';

-- AlterTable
ALTER TABLE "SOA" DROP COLUMN "efektivitas",
ADD COLUMN     "targetDate" TIMESTAMP(3);
