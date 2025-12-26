/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { externalStakeholderController } from '../controllers/organization/external-stakeholder.controller';
import { validate, authenticate, hasAccess } from '../middleware';
import {
  createExternalStakeholderJoiSchema,
  updateExternalStakeholderJoiSchema,
} from '../validators/organization/external-stakeholder.validator';

const router: Router = express.Router();

// POST /external-stakeholders - Create external stakeholder (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.post(
  '',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(createExternalStakeholderJoiSchema),
  externalStakeholderController.createExternalStakeholder,
);

// GET /external-stakeholders - Get all external stakeholders (Protected, all roles can read own organization)
router.get('', authenticate, externalStakeholderController.getExternalStakeholders);

// GET /external-stakeholders/:id - Get external stakeholder by ID (Protected, all roles can read own organization)
router.get('/:id', authenticate, externalStakeholderController.getExternalStakeholderById);

// PATCH /external-stakeholders/:id - Update external stakeholder (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(updateExternalStakeholderJoiSchema),
  externalStakeholderController.updateExternalStakeholder,
);

// DELETE /external-stakeholders/:id - Delete external stakeholder (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  externalStakeholderController.deleteExternalStakeholder,
);

export default router;
