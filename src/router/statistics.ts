/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { statisticsController } from '../controllers/statistics';
import { authenticate } from '../middleware';

const router: Router = express.Router();

// GET /statistics - Get dashboard statistics
router.get('/', authenticate, statisticsController.getStatistics);

export default router;
