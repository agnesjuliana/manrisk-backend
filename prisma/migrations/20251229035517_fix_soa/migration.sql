/*
  Warnings:

  - The values [BERJALAN,DIRENCANAKAN,TIDAK_KOMPATIBEL,DIHENTIKAN] on the enum `SOAStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ControlImplementationStatus" AS ENUM ('DIRENCANAKAN', 'BERJALAN', 'DIHENTIKAN');

-- AlterEnum
BEGIN;
CREATE TYPE "SOAStatus_new" AS ENUM ('BELUM_DITENTUKAN', 'RELEVAN', 'TIDAK_RELEVAN');
ALTER TABLE "SOA" ALTER COLUMN "status" TYPE "SOAStatus_new" USING ("status"::text::"SOAStatus_new");
ALTER TYPE "SOAStatus" RENAME TO "SOAStatus_old";
ALTER TYPE "SOAStatus_new" RENAME TO "SOAStatus";
DROP TYPE "public"."SOAStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "SOA" ADD COLUMN     "implementationStatus" "ControlImplementationStatus";
