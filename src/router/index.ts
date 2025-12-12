import express, { type Router } from 'express';

const router: Router = express.Router();

import UserRoutes from './user.router';

router.use('/users', UserRoutes);

// eslint-disable-next-line import/no-default-export
export default router;
