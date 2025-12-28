import express, { type Router } from 'express';

const router: Router = express.Router();

import assetRouter from './asset';
import assetApprovalRouter from './asset-approval';
import CiaObjectiveRoutes from './cia-objective';
import ContextRoutes from './context';
import controlRouter from './control';
import DepartmentRoutes from './department';
import ExternalStakeholderRoutes from './external-stakeholder';
import OrganizationRoutes from './organization';
import { regulationRouter } from './regulation';
import riskApprovalRouter from './risk-approval';
import riskCriteriaRouter from './risk-criteria';
import riskRegisterRouter from './risk-register';
import soaRouter from './soa';
import UserManagementRoutes from './user-management';
import UserRoutes from './user.router';

router.use('/users', UserRoutes);
router.use('/organizations', OrganizationRoutes);
router.use('/departments', DepartmentRoutes);
router.use('/contexts', ContextRoutes);
router.use('/external-stakeholders', ExternalStakeholderRoutes);
router.use('/cia', CiaObjectiveRoutes);
router.use('/user-management', UserManagementRoutes);
router.use('/regulations', regulationRouter);
router.use('/risk-criteria', riskCriteriaRouter);
router.use('/assets', assetRouter);
router.use('/asset-approvals', assetApprovalRouter);
router.use('/risk-registers', riskRegisterRouter);
router.use('/risk-approvals', riskApprovalRouter);
router.use('/controls', controlRouter);
router.use('/soa', soaRouter);

// eslint-disable-next-line import/no-default-export
export default router;
