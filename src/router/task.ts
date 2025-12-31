/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { taskController } from '../controllers/task';
import { authenticate } from '../middleware';

const router: Router = express.Router();

router.get('/', authenticate, taskController.getUserTasks);

export default router;
