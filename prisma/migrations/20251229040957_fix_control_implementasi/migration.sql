/*
  Warnings:

  - The values [BERJALAN] on the enum `ControlImplementationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ControlImplementationStatus_new" AS ENUM ('DIRENCANAKAN', 'DALAM_IMPLEMENTASI', 'DIIMPLEMENTASIKAN', 'DIHENTIKAN');
ALTER TABLE "SOA" ALTER COLUMN "implementationStatus" TYPE "ControlImplementationStatus_new" USING ("implementationStatus"::text::"ControlImplementationStatus_new");
ALTER TYPE "ControlImplementationStatus" RENAME TO "ControlImplementationStatus_old";
ALTER TYPE "ControlImplementationStatus_new" RENAME TO "ControlImplementationStatus";
DROP TYPE "public"."ControlImplementationStatus_old";
COMMIT;
