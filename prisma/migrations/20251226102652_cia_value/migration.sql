/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,type]` on the table `CIAObjective` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `CIAObjective` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CIAObjective" ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CIAObjective_organizationId_type_key" ON "CIAObjective"("organizationId", "type");
