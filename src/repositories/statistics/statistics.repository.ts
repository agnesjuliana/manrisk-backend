import prisma from '../../config/prisma';
import { type DashboardStatisticsResponse } from '../../models/statistics';

export async function getDashboardStatistics(
  organizationId: string,
): Promise<DashboardStatisticsResponse> {
  // 1. Total Risks
  const totalRisks = await prisma.riskRegister.count({
    where: { organizationId },
  });

  // 2. Total Treatment Plans
  const totalTreatmentPlans = await prisma.treatment.count({
    where: { organizationId },
  });

  // 3. Total Controls (organization + global)
  const totalControls = await prisma.control.count({
    where: {
      OR: [{ organizationId }, { organizationId: null }],
    },
  });

  // 4. Total Approved Risks
  const totalApprovedRisks = await prisma.riskRegister.count({
    where: {
      organizationId,
      status: 'DISETUJUI',
    },
  });

  const approvedRisksPercentage = totalRisks > 0 ? (totalApprovedRisks / totalRisks) * 100 : 0;

  // 5. Severity Distribution (dynamic based on RiskCriteria scales)
  const scaleStatuses = await prisma.scaleStatus.findMany({
    where: {
      riskCriteria: {
        organizationId,
      },
    },
    select: {
      level: true,
      title: true,
    },
    orderBy: { level: 'asc' },
  });

  // Get all risks with their severity
  const risksWithSeverity = await prisma.riskRegister.findMany({
    where: { organizationId },
    select: {
      impactSeverity: true,
    },
  });

  // Build severity distribution from scale statuses
  const severityDistribution = scaleStatuses.map((scale) => ({
    label: scale.title,
    value: scale.level,
    count: risksWithSeverity.filter((r) => r.impactSeverity === scale.level).length,
  }));

  // 6. Risk Status Distribution
  const riskStatusCounts = await prisma.riskRegister.groupBy({
    by: ['status'],
    _count: true,
    where: { organizationId },
  });

  const riskStatusDistribution = {
    draft: riskStatusCounts.find((r) => r.status === 'DRAFT')?._count || 0,
    submitted: riskStatusCounts
      .filter((r) => ['MENUNGGU_PERSETUJUAN_RM', 'MENUNGGU_PERSETUJUAN_FINAL', 'REVISI'].includes(r.status))
      .reduce((sum, r) => sum + r._count, 0),
    approved: riskStatusCounts.find((r) => r.status === 'DISETUJUI')?._count || 0,
  };

  // 7. Control Implementation Status (from SOA)
  const controlImplementationCounts = await prisma.sOA.groupBy({
    by: ['status'],
    _count: true,
    where: {
      organizationId,
      control: {
        OR: [{ organizationId }, { organizationId: null }],
      },
    },
  });

  const controlImplementationStatus = {
    implemented: controlImplementationCounts
      .filter((c) => ['DIIMPLEMENTASIKAN'].includes(c.status || ''))
      .reduce((sum, c) => sum + c._count, 0),
    inProgress: controlImplementationCounts
      .filter((c) => ['DALAM_IMPLEMENTASI'].includes(c.status || ''))
      .reduce((sum, c) => sum + c._count, 0),
    planned: controlImplementationCounts
      .filter((c) => ['DIRENCANAKAN'].includes(c.status || ''))
      .reduce((sum, c) => sum + c._count, 0),
  };

  // 8. Top Critical Risks (sorted by severity, then likelihood)
  const risksData = await prisma.riskRegister.findMany({
    where: { organizationId },
    select: {
      id: true,
      customRiskId: true,
      identifiedRisk: true,
      threat: true,
      vulnerability: true,
      impactSeverity: true,
      likelihoodOccurence: true,
      detection: true,
      status: true,
    },
    orderBy: [{ impactSeverity: 'desc' }, { likelihoodOccurence: 'desc' }],
    take: 5,
  });

  const topCriticalRisks = risksData.map((risk) => ({
    id: risk.id,
    customRiskId: risk.customRiskId,
    identifiedRisk: risk.identifiedRisk,
    threat: risk.threat || '',
    vulnerability: risk.vulnerability || '',
    impactSeverity: risk.impactSeverity,
    likelihoodOccurence: risk.likelihoodOccurence,
    detection: risk.detection,
    status: risk.status || '',
    priority: determinePriority(risk.impactSeverity, risk.likelihoodOccurence),
  }));

  // 9. Priority Analysis (above/equal threshold vs below threshold)
  const riskCriteria = await prisma.riskCriteria.findFirst({
    where: { organizationId },
    select: {
      isFMEA: true,
      threshold: true,
    },
  });

  const allRisks = await prisma.riskRegister.findMany({
    where: { organizationId },
    select: {
      impactSeverity: true,
      likelihoodOccurence: true,
      detection: true,
    },
  });

  let aboveThresholdCount = 0;
  let belowThresholdCount = 0;

  const isFMEA = riskCriteria?.isFMEA || false;
  const threshold = riskCriteria?.threshold || 0;

  for (const risk of allRisks) {
    const score = isFMEA
      ? (risk.impactSeverity || 0) * (risk.likelihoodOccurence || 0) * (risk.detection || 0)
      : (risk.impactSeverity || 0) * (risk.likelihoodOccurence || 0);

    if (score >= threshold) {
      aboveThresholdCount++;
    } else {
      belowThresholdCount++;
    }
  }

  // 10. Treatment Coverage
  const risksWithTreatments = await prisma.riskRegister.findMany({
    where: { organizationId },
    select: {
      id: true,
      treatments: {
        select: { id: true },
      },
    },
  });

  const coveredRisks = risksWithTreatments.filter((r) => r.treatments.length > 0).length;

  const treatmentCoverage = {
    coveredRisks,
    totalRisks,
  };

  // 11. Approved Risks Coverage
  const approvedRisksCoverage = {
    approvedRisks: totalApprovedRisks,
    totalRisks,
  };

  return {
    totalRisks,
    totalTreatmentPlans,
    totalControls,
    totalApprovedRisks,
    approvedRisksPercentage: Math.round(approvedRisksPercentage * 100) / 100,
    severityDistribution,
    riskStatusDistribution,
    controlImplementationStatus,
    topCriticalRisks,
    priorityAnalysis: {
      aboveThreshold: aboveThresholdCount,
      belowThreshold: belowThresholdCount,
    },
    treatmentCoverage,
    approvedRisksCoverage,
  };
}

/**
 * Helper function to determine priority based on severity and likelihood
 */
function determinePriority(severity?: number, likelihood?: number): string {
  const score = (severity || 0) * (likelihood || 0);

  return score >= 12
    ? 'High Priority'
    : (score >= 6 ? 'Medium Priority' : 'Low Priority');
}
