export interface RiskSourceData {
  id: string;
  organizationId: string | null;
  title: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
