/*
  Warnings:

  - The values [DRAFT,REVISI] on the enum `AssetApprovalTLStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssetApprovalTLStatus_new" AS ENUM ('MENUNGGU_PERSETUJUAN_FINAL', 'DITOLAK', 'DISETUJUI');
ALTER TABLE "public"."AssetApprovalTL" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "AssetApprovalTL" ALTER COLUMN "status" TYPE "AssetApprovalTLStatus_new" USING ("status"::text::"AssetApprovalTLStatus_new");
ALTER TYPE "AssetApprovalTLStatus" RENAME TO "AssetApprovalTLStatus_old";
ALTER TYPE "AssetApprovalTLStatus_new" RENAME TO "AssetApprovalTLStatus";
DROP TYPE "public"."AssetApprovalTLStatus_old";
ALTER TABLE "AssetApprovalTL" ALTER COLUMN "status" SET DEFAULT 'MENUNGGU_PERSETUJUAN_FINAL';
COMMIT;

-- AlterTable
ALTER TABLE "AssetApprovalTL" ALTER COLUMN "status" SET DEFAULT 'MENUNGGU_PERSETUJUAN_FINAL';
