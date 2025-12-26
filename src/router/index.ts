import express, { type Router } from 'express';

const router: Router = express.Router();

import CiaObjectiveRoutes from './cia-objective';
import ContextRoutes from './context';
import DepartmentRoutes from './department';
import ExternalStakeholderRoutes from './external-stakeholder';
import OrganizationRoutes from './organization';
import UserManagementRoutes from './user-management';
import UserRoutes from './user.router';

router.use('/users', UserRoutes);
router.use('/organizations', OrganizationRoutes);
router.use('/departments', DepartmentRoutes);
router.use('/contexts', ContextRoutes);
router.use('/external-stakeholders', ExternalStakeholderRoutes);
router.use('/cia', CiaObjectiveRoutes);
router.use('/user-management', UserManagementRoutes);

// eslint-disable-next-line import/no-default-export
export default router;
