// Asset Task Models
export interface AssetTaskItem {
  id: string;
  name: string;
  location?: string;
  status: string;
  taskType: 'REVISION' | 'PENDING_RM_APPROVAL' | 'REJECTED_BY_TL' | 'PENDING_TL_APPROVAL';
  owner: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface AssetTaskResponse {
  assetTasks: AssetTaskItem[];
  totalAssetTasks: number;
}

// Risk Task Models
export interface RiskTaskItem {
  id: string;
  customRiskId: string;
  identifiedRisk: string;
  status: string;
  taskType: 'REVISION' | 'PENDING_RM_APPROVAL' | 'REJECTED_BY_TL' | 'PENDING_TL_APPROVAL';
  owner: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    title: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface RiskTaskResponse {
  riskTasks: RiskTaskItem[];
  totalRiskTasks: number;
}

// Treatment Task Models
export interface TreatmentTaskItem {
  id: string;
  riskId: string;
  customRiskId: string;
  identifiedRisk: string;
  treatmentOpt: string;
  taskType: 'PENDING_APPROVAL' | 'NEEDS_TREATMENT';
  manager: {
    id: string;
    name: string;
    email: string;
  };
  pic?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface TreatmentTaskResponse {
  treatmentTasks: TreatmentTaskItem[];
  totalTreatmentTasks: number;
}

// Control Task Models
export interface ControlTaskItem {
  id: string;
  code: string;
  title: string;
  category?: string;
  isAnnex: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ControlTaskResponse {
  controlTasks: ControlTaskItem[];
  totalControlTasks: number;
}

// SOA Task Models
export interface SOATaskItem {
  id: string;
  controlId: string;
  controlCode: string;
  controlTitle: string;
  status?: string;
  implementationStatus?: string;
  statusTarget?: 'ON_TRACK' | 'OVERDUE';
  targetDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SOATaskResponse {
  soaTasks: SOATaskItem[];
  totalSOATasks: number;
}

// Combined Task Response
export interface UserTasksResponse {
  assets: AssetTaskResponse;
  risks: RiskTaskResponse;
  treatments: TreatmentTaskResponse;
  controls: ControlTaskResponse;
  soas: SOATaskResponse;
}

