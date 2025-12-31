/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { riskRegisterRevisionController } from '../controllers/risk-register';
import { authenticate, hasAccess, validate } from '../middleware';
import {
  createRiskRegisterRevisionSchema,
  updateRiskRegisterRevisionSchema,
} from '../validators/risk-register/risk-register-revision.validator';

const router: Router = express.Router();

// Risk Register Revision Log CRUD Routes

// POST /risk-revisions - Create Risk Revision (only RISK_MANAGER and TOP_MANAGEMENT)
router.post(
  '/',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(createRiskRegisterRevisionSchema),
  riskRegisterRevisionController.createRiskRegisterRevision,
);

// GET /risk-revisions - Get all Risk Revisions with Treatment expand (all roles)
router.get('/', authenticate, riskRegisterRevisionController.getRiskRevisions);

// GET /risk-revisions/:id - Get Risk Revision detail by ID (all roles)
router.get('/:id', authenticate, riskRegisterRevisionController.getRiskRevisionById);

// PATCH /risk-revisions/:id - Update Risk Revision (only RISK_MANAGER and TOP_MANAGEMENT)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(updateRiskRegisterRevisionSchema),
  riskRegisterRevisionController.updateRiskRegisterRevision,
);

// DELETE /risk-revisions/:id - Delete Risk Revision (only RISK_MANAGER and TOP_MANAGEMENT)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  riskRegisterRevisionController.deleteRiskRegisterRevision,
);

export default router;
