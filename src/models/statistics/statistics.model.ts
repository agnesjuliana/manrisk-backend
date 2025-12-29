export interface SeverityDistributionItem {
  label: string;
  value: number;
  count: number;
}

export interface RiskStatusDistribution {
  draft: number;
  submitted: number;
  approved: number;
}

export interface ControlImplementationStatus {
  implemented: number;
  inProgress: number;
  planned: number;
}

export interface TopCriticalRisk {
  id: string;
  customRiskId: string;
  identifiedRisk: string;
  threat: string;
  vulnerability: string;
  impactSeverity?: number;
  likelihoodOccurence?: number;
  detection?: number;
  status: string;
  priority: string;
}

export interface PriorityAnalysis {
  aboveThreshold: number;
  belowThreshold: number;
}

export interface TreatmentCoverage {
  coveredRisks: number;
  totalRisks: number;
}

export interface ApprovedRisksCoverage {
  approvedRisks: number;
  totalRisks: number;
}

export interface DashboardStatisticsResponse {
  // Summary cards
  totalRisks: number;
  totalTreatmentPlans: number;
  totalControls: number;
  totalApprovedRisks: number;
  approvedRisksPercentage: number;

  // Severity distribution (dynamic based on RiskCriteria)
  severityDistribution: SeverityDistributionItem[];

  // Risk status distribution
  riskStatusDistribution: RiskStatusDistribution;

  // Control implementation status
  controlImplementationStatus: ControlImplementationStatus;

  // Top critical risks
  topCriticalRisks: TopCriticalRisk[];

  // Priority analysis (above/equal threshold vs below threshold)
  priorityAnalysis: PriorityAnalysis;

  // Treatment coverage
  treatmentCoverage: TreatmentCoverage;

  // Approved risks coverage
  approvedRisksCoverage: ApprovedRisksCoverage;
}
