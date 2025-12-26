import express, { type Router } from 'express';

const router: Router = express.Router();

import DepartmentRoutes from './department';
import OrganizationRoutes from './organization';
import UserRoutes from './user.router';
import UserManagementRoutes from './user-management';

router.use('/users', UserRoutes);
router.use('/organizations', OrganizationRoutes);
router.use('/departments', DepartmentRoutes);
router.use('/user-management', UserManagementRoutes);

// eslint-disable-next-line import/no-default-export
export default router;
