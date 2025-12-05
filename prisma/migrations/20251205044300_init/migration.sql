-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RISK_MANAGER', 'RISK_OWNER');

-- CreateEnum
CREATE TYPE "CIA" AS ENUM ('C', 'I', 'A');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('DRAFT', 'MENUNGGU_PERSETUJUAN_RM', 'MENUNGGU_PERSETUJUAN_FINAL', 'REVISI', 'DISETUJUI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "RiskRegisterStatus" AS ENUM ('DRAFT', 'MENUNGGU_PERSETUJUAN_RM', 'MENUNGGU_PERSETUJUAN_FINAL', 'REVISI', 'DISETUJUI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "TreatmentOption" AS ENUM ('MITIGATE', 'ACCEPT', 'AVOID', 'TRANSFER');

-- CreateEnum
CREATE TYPE "SOAStatus" AS ENUM ('BERJALAN', 'DIRENCANAKAN', 'TIDAK_KOMPATIBEL');

-- CreateEnum
CREATE TYPE "AudittrailAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "departmentId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noTelp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Context" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalStakeholder" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExternalStakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CIAObjective" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "CIA" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CIAObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePriority" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contextId" TEXT,
    "serviceName" TEXT NOT NULL,
    "cScore" INTEGER NOT NULL,
    "iScore" INTEGER NOT NULL,
    "aScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ServicePriority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regulation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Regulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskCriteria" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "isFMEA" BOOLEAN NOT NULL,
    "scale" INTEGER NOT NULL,
    "threshold" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RiskCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScaleStatus" (
    "id" TEXT NOT NULL,
    "riskCriteriaId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ScaleStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetType" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AssetType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetClassification" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AssetClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "classificationId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "status" "AssetStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskCategory" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RiskCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskSource" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RiskSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRegister" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "assetId" TEXT,
    "contextId" TEXT,
    "riskCategoryId" TEXT NOT NULL,
    "riskSourceId" TEXT,
    "customRiskId" TEXT NOT NULL,
    "vulnerability" TEXT NOT NULL,
    "threat" TEXT NOT NULL,
    "identifiedRisk" TEXT NOT NULL,
    "detail" TEXT,
    "isConfidentiality" BOOLEAN NOT NULL DEFAULT false,
    "isIntegrity" BOOLEAN NOT NULL DEFAULT false,
    "isAvailability" BOOLEAN NOT NULL DEFAULT false,
    "impactSeverity" INTEGER,
    "likelihoodOccurence" INTEGER,
    "detection" INTEGER,
    "status" "RiskRegisterStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RiskRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRegisterRevisionLog" (
    "id" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "contextId" TEXT,
    "riskCategoryId" TEXT NOT NULL,
    "riskSourceId" TEXT,
    "customRiskId" TEXT NOT NULL,
    "vulnerability" TEXT NOT NULL,
    "threat" TEXT NOT NULL,
    "identifiedRisk" TEXT NOT NULL,
    "detail" TEXT,
    "isConfidentiality" BOOLEAN NOT NULL DEFAULT false,
    "isIntegrity" BOOLEAN NOT NULL DEFAULT false,
    "isAvailability" BOOLEAN NOT NULL DEFAULT false,
    "impactSeverity" INTEGER,
    "likelihoodOccurence" INTEGER,
    "detection" INTEGER,
    "isApprovedByOwner" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RiskRegisterRevisionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskApprovalTL" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "message" TEXT,
    "status" "RiskRegisterStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RiskApprovalTL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskApprovalTLRisk" (
    "id" TEXT NOT NULL,
    "riskApprovalTLId" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,

    CONSTRAINT "RiskApprovalTLRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Control" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isAnnex" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Control_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "picId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "treatmentOpt" "TreatmentOption" NOT NULL,
    "impactSeverityTarget" INTEGER,
    "likelihoodOccurenceTarget" INTEGER,
    "detectionTarget" INTEGER,
    "actionReason" TEXT,
    "detailedActionPlan" TEXT NOT NULL,
    "startAction" TIMESTAMP(3) NOT NULL,
    "endAction" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "isApprovedByTop" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentControl" (
    "id" TEXT NOT NULL,
    "treatmentId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,

    CONSTRAINT "TreatmentControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReassessmentRisk" (
    "id" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "impactSeverity" INTEGER,
    "likelihoodOccurence" INTEGER,
    "detection" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReassessmentRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOA" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "status" "SOAStatus",
    "efektivitas" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SOA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audittrail" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "assetId" TEXT,
    "riskId" TEXT,
    "treatmentId" TEXT,
    "reassessmentId" TEXT,
    "soaId" TEXT,
    "action" "AudittrailAction" NOT NULL,
    "status" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audittrail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "User_departmentId_idx" ON "User"("departmentId");

-- CreateIndex
CREATE INDEX "Context_organizationId_idx" ON "Context"("organizationId");

-- CreateIndex
CREATE INDEX "ExternalStakeholder_organizationId_idx" ON "ExternalStakeholder"("organizationId");

-- CreateIndex
CREATE INDEX "CIAObjective_organizationId_idx" ON "CIAObjective"("organizationId");

-- CreateIndex
CREATE INDEX "ServicePriority_organizationId_idx" ON "ServicePriority"("organizationId");

-- CreateIndex
CREATE INDEX "ServicePriority_contextId_idx" ON "ServicePriority"("contextId");

-- CreateIndex
CREATE INDEX "Regulation_organizationId_idx" ON "Regulation"("organizationId");

-- CreateIndex
CREATE INDEX "RiskCriteria_organizationId_idx" ON "RiskCriteria"("organizationId");

-- CreateIndex
CREATE INDEX "ScaleStatus_riskCriteriaId_idx" ON "ScaleStatus"("riskCriteriaId");

-- CreateIndex
CREATE INDEX "AssetType_organizationId_idx" ON "AssetType"("organizationId");

-- CreateIndex
CREATE INDEX "AssetClassification_organizationId_idx" ON "AssetClassification"("organizationId");

-- CreateIndex
CREATE INDEX "Asset_organizationId_idx" ON "Asset"("organizationId");

-- CreateIndex
CREATE INDEX "Asset_typeId_idx" ON "Asset"("typeId");

-- CreateIndex
CREATE INDEX "Asset_classificationId_idx" ON "Asset"("classificationId");

-- CreateIndex
CREATE INDEX "Asset_ownerId_idx" ON "Asset"("ownerId");

-- CreateIndex
CREATE INDEX "RiskCategory_organizationId_idx" ON "RiskCategory"("organizationId");

-- CreateIndex
CREATE INDEX "RiskSource_organizationId_idx" ON "RiskSource"("organizationId");

-- CreateIndex
CREATE INDEX "RiskRegister_organizationId_idx" ON "RiskRegister"("organizationId");

-- CreateIndex
CREATE INDEX "RiskRegister_ownerId_idx" ON "RiskRegister"("ownerId");

-- CreateIndex
CREATE INDEX "RiskRegister_assetId_idx" ON "RiskRegister"("assetId");

-- CreateIndex
CREATE INDEX "RiskRegister_contextId_idx" ON "RiskRegister"("contextId");

-- CreateIndex
CREATE INDEX "RiskRegister_riskCategoryId_idx" ON "RiskRegister"("riskCategoryId");

-- CreateIndex
CREATE INDEX "RiskRegister_riskSourceId_idx" ON "RiskRegister"("riskSourceId");

-- CreateIndex
CREATE INDEX "RiskRegisterRevisionLog_riskId_idx" ON "RiskRegisterRevisionLog"("riskId");

-- CreateIndex
CREATE INDEX "RiskRegisterRevisionLog_managerId_idx" ON "RiskRegisterRevisionLog"("managerId");

-- CreateIndex
CREATE INDEX "RiskRegisterRevisionLog_contextId_idx" ON "RiskRegisterRevisionLog"("contextId");

-- CreateIndex
CREATE INDEX "RiskRegisterRevisionLog_riskCategoryId_idx" ON "RiskRegisterRevisionLog"("riskCategoryId");

-- CreateIndex
CREATE INDEX "RiskRegisterRevisionLog_riskSourceId_idx" ON "RiskRegisterRevisionLog"("riskSourceId");

-- CreateIndex
CREATE INDEX "RiskApprovalTL_organizationId_idx" ON "RiskApprovalTL"("organizationId");

-- CreateIndex
CREATE INDEX "RiskApprovalTL_managerId_idx" ON "RiskApprovalTL"("managerId");

-- CreateIndex
CREATE INDEX "RiskApprovalTLRisk_riskApprovalTLId_idx" ON "RiskApprovalTLRisk"("riskApprovalTLId");

-- CreateIndex
CREATE INDEX "RiskApprovalTLRisk_riskId_idx" ON "RiskApprovalTLRisk"("riskId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskApprovalTLRisk_riskApprovalTLId_riskId_key" ON "RiskApprovalTLRisk"("riskApprovalTLId", "riskId");

-- CreateIndex
CREATE INDEX "Control_organizationId_idx" ON "Control"("organizationId");

-- CreateIndex
CREATE INDEX "Treatment_riskId_idx" ON "Treatment"("riskId");

-- CreateIndex
CREATE INDEX "Treatment_managerId_idx" ON "Treatment"("managerId");

-- CreateIndex
CREATE INDEX "Treatment_picId_idx" ON "Treatment"("picId");

-- CreateIndex
CREATE INDEX "Treatment_organizationId_idx" ON "Treatment"("organizationId");

-- CreateIndex
CREATE INDEX "TreatmentControl_treatmentId_idx" ON "TreatmentControl"("treatmentId");

-- CreateIndex
CREATE INDEX "TreatmentControl_controlId_idx" ON "TreatmentControl"("controlId");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentControl_treatmentId_controlId_key" ON "TreatmentControl"("treatmentId", "controlId");

-- CreateIndex
CREATE INDEX "ReassessmentRisk_riskId_idx" ON "ReassessmentRisk"("riskId");

-- CreateIndex
CREATE INDEX "ReassessmentRisk_managerId_idx" ON "ReassessmentRisk"("managerId");

-- CreateIndex
CREATE INDEX "ReassessmentRisk_organizationId_idx" ON "ReassessmentRisk"("organizationId");

-- CreateIndex
CREATE INDEX "SOA_organizationId_idx" ON "SOA"("organizationId");

-- CreateIndex
CREATE INDEX "SOA_controlId_idx" ON "SOA"("controlId");

-- CreateIndex
CREATE INDEX "SOA_managerId_idx" ON "SOA"("managerId");

-- CreateIndex
CREATE INDEX "Audittrail_userId_idx" ON "Audittrail"("userId");

-- CreateIndex
CREATE INDEX "Audittrail_assetId_idx" ON "Audittrail"("assetId");

-- CreateIndex
CREATE INDEX "Audittrail_riskId_idx" ON "Audittrail"("riskId");

-- CreateIndex
CREATE INDEX "Audittrail_treatmentId_idx" ON "Audittrail"("treatmentId");

-- CreateIndex
CREATE INDEX "Audittrail_reassessmentId_idx" ON "Audittrail"("reassessmentId");

-- CreateIndex
CREATE INDEX "Audittrail_soaId_idx" ON "Audittrail"("soaId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Context" ADD CONSTRAINT "Context_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalStakeholder" ADD CONSTRAINT "ExternalStakeholder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CIAObjective" ADD CONSTRAINT "CIAObjective_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePriority" ADD CONSTRAINT "ServicePriority_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePriority" ADD CONSTRAINT "ServicePriority_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "Context"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regulation" ADD CONSTRAINT "Regulation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskCriteria" ADD CONSTRAINT "RiskCriteria_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScaleStatus" ADD CONSTRAINT "ScaleStatus_riskCriteriaId_fkey" FOREIGN KEY ("riskCriteriaId") REFERENCES "RiskCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetType" ADD CONSTRAINT "AssetType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetClassification" ADD CONSTRAINT "AssetClassification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AssetType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "AssetClassification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskCategory" ADD CONSTRAINT "RiskCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskSource" ADD CONSTRAINT "RiskSource_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegister" ADD CONSTRAINT "RiskRegister_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegister" ADD CONSTRAINT "RiskRegister_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegister" ADD CONSTRAINT "RiskRegister_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegister" ADD CONSTRAINT "RiskRegister_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "Context"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegister" ADD CONSTRAINT "RiskRegister_riskCategoryId_fkey" FOREIGN KEY ("riskCategoryId") REFERENCES "RiskCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegister" ADD CONSTRAINT "RiskRegister_riskSourceId_fkey" FOREIGN KEY ("riskSourceId") REFERENCES "RiskSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegisterRevisionLog" ADD CONSTRAINT "RiskRegisterRevisionLog_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegisterRevisionLog" ADD CONSTRAINT "RiskRegisterRevisionLog_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegisterRevisionLog" ADD CONSTRAINT "RiskRegisterRevisionLog_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "Context"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegisterRevisionLog" ADD CONSTRAINT "RiskRegisterRevisionLog_riskCategoryId_fkey" FOREIGN KEY ("riskCategoryId") REFERENCES "RiskCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRegisterRevisionLog" ADD CONSTRAINT "RiskRegisterRevisionLog_riskSourceId_fkey" FOREIGN KEY ("riskSourceId") REFERENCES "RiskSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskApprovalTL" ADD CONSTRAINT "RiskApprovalTL_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskApprovalTL" ADD CONSTRAINT "RiskApprovalTL_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskApprovalTLRisk" ADD CONSTRAINT "RiskApprovalTLRisk_riskApprovalTLId_fkey" FOREIGN KEY ("riskApprovalTLId") REFERENCES "RiskApprovalTL"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskApprovalTLRisk" ADD CONSTRAINT "RiskApprovalTLRisk_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Control" ADD CONSTRAINT "Control_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_picId_fkey" FOREIGN KEY ("picId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentControl" ADD CONSTRAINT "TreatmentControl_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentControl" ADD CONSTRAINT "TreatmentControl_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReassessmentRisk" ADD CONSTRAINT "ReassessmentRisk_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReassessmentRisk" ADD CONSTRAINT "ReassessmentRisk_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReassessmentRisk" ADD CONSTRAINT "ReassessmentRisk_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOA" ADD CONSTRAINT "SOA_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOA" ADD CONSTRAINT "SOA_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOA" ADD CONSTRAINT "SOA_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audittrail" ADD CONSTRAINT "Audittrail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
