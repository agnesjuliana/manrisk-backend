/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { riskCriteriaController } from '../controllers/organization/risk-criteria.controller';
import { authenticate, validate, hasAccess } from '../middleware';
import { createRiskCriteriaSchema } from '../validators/organization/risk-criteria.validator';

const router: Router = express.Router();

// POST /risk-criteria - Upsert risk criteria (Protected, ADMIN/RISK_MANAGER/TOP_MANAGEMENT only)
router.post(
  '',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(createRiskCriteriaSchema),
  riskCriteriaController.upsertRiskCriteria,
);

export default router;
