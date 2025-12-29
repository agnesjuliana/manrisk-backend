/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { treatmentController } from '../controllers/treatment';
import { authenticate, hasAccess, validate } from '../middleware';
import { createTreatmentSchema, updateTreatmentSchema } from '../validators/treatment';

const router: Router = express.Router();

// Treatment CRUD Routes
// POST /treatments - Create Treatment (only RISK_MANAGER and TOP_MANAGEMENT)
router.post(
  '/',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(createTreatmentSchema),
  treatmentController.createTreatment,
);

// GET /treatments - Get all treatments (all roles)
router.get('/', authenticate, treatmentController.getTreatments);

// GET /treatments/:id - Get treatment by ID (all roles)
router.get('/:id', authenticate, treatmentController.getTreatmentById);

// PATCH /treatments/:id - Update treatment (only RISK_MANAGER and TOP_MANAGEMENT)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(updateTreatmentSchema),
  treatmentController.updateTreatment,
);

// DELETE /treatments/:id - Delete treatment (only RISK_MANAGER and TOP_MANAGEMENT)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  treatmentController.deleteTreatment,
);

export default router;
