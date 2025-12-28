/*
  Warnings:

  - The `status` column on the `RiskApprovalTL` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RiskApprovalTLStatus" AS ENUM ('MENUNGGU_PERSETUJUAN_FINAL', 'DITOLAK', 'DISETUJUI');

-- AlterTable
ALTER TABLE "RiskApprovalTL" DROP COLUMN "status",
ADD COLUMN     "status" "RiskApprovalTLStatus" NOT NULL DEFAULT 'MENUNGGU_PERSETUJUAN_FINAL';
