import express, { type Router } from 'express';

const router: Router = express.Router();

import OrganizationRoutes from './organization.router';
import UserRoutes from './user.router';

router.use('/users', UserRoutes);
router.use('/organizations', OrganizationRoutes);

// eslint-disable-next-line import/no-default-export
export default router;
