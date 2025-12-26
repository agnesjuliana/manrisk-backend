/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { ciaObjectiveController } from '../controllers/organization/cia-objective.controller';
import { validate, authenticate, hasAccess } from '../middleware';
import {
  upsertCIAObjectiveJoiSchema,
  createServicePriorityJoiSchema,
  updateServicePriorityJoiSchema,
} from '../validators/organization/cia-objective.validator';

const router: Router = express.Router();

// CIA Objectives Routes
// POST /cia/objectives - Upsert CIA Objective (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.post(
  '/',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(upsertCIAObjectiveJoiSchema),
  ciaObjectiveController.upsertCIAObjective,
);

// GET /cia/objectives - Get CIA Objective (Protected, all roles can read own organization)
router.get('/', authenticate, ciaObjectiveController.getCIAObjective);

// Service Priority Routes
// POST /cia/priority - Create Service Priority (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.post(
  '/priority',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(createServicePriorityJoiSchema),
  ciaObjectiveController.createServicePriority,
);

// GET /cia/priority/:id - Get Service Priority by ID (Protected, all roles can read own organization)
router.get('/priority/:id', authenticate, ciaObjectiveController.getServicePriorityById);

// PATCH /cia/priority/:id - Update Service Priority (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.patch(
  '/priority/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(updateServicePriorityJoiSchema),
  ciaObjectiveController.updateServicePriority,
);

// DELETE /cia/priority/:id - Delete Service Priority (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.delete(
  '/priority/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  ciaObjectiveController.deleteServicePriority,
);

export default router;
