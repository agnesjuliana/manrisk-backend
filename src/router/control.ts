/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { controlController } from '../controllers/control';
import { authenticate, hasAccess, validate } from '../middleware';
import { createControlSchema, updateControlSchema } from '../validators/control';

const router: Router = express.Router();

// Control CRUD Routes
// POST /controls - Create control
router.post(
  '/',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(createControlSchema),
  controlController.createControl,
);

// GET /controls - Get all controls
router.get('/', authenticate, controlController.getControls);

// GET /controls/statistics - Get control statistics
router.get('/statistics', authenticate, controlController.getStatistics);

// GET /controls/:id - Get control by ID
router.get('/:id', authenticate, controlController.getControlById);

// PATCH /controls/:id - Update control
router.patch(
  '/:id',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(updateControlSchema),
  controlController.updateControl,
);

// DELETE /controls/:id - Delete control
router.delete(
  '/:id',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  controlController.deleteControl,
);

export default router;
