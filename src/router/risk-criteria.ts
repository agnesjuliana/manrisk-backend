/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { riskCriteriaController } from '../controllers/organization/risk-criteria.controller';
import { scaleStatusController } from '../controllers/organization/scale-status.controller';
import { authenticate, validate, hasAccess } from '../middleware';
import { createRiskCriteriaSchema } from '../validators/organization/risk-criteria.validator';
import { upsertScaleStatusSchema } from '../validators/organization/scale-status.validator';

const router: Router = express.Router();

// GET /risk-criteria - Get risk criteria with scale status (Protected)
router.get(
  '',
  authenticate,
  riskCriteriaController.getRiskCriteria,
);

// POST /risk-criteria - Upsert risk criteria (Protected, ADMIN/RISK_MANAGER/TOP_MANAGEMENT only)
router.post(
  '',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(createRiskCriteriaSchema),
  riskCriteriaController.upsertRiskCriteria,
);

// POST /risk-criteria/scale - Upsert scale status (Protected, ADMIN/RISK_MANAGER/TOP_MANAGEMENT only)
router.post(
  '/scale',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(upsertScaleStatusSchema),
  scaleStatusController.upsertScaleStatus,
);

export default router;
