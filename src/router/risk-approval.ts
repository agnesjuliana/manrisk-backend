/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { riskApprovalController } from '../controllers/risk-approval';
import { authenticate, hasAccess, validate } from '../middleware';
import { createRiskApprovalSchema, updateRiskApprovalSchema } from '../validators/risk-approval';

const router: Router = express.Router();

// Risk Approval CRUD Routes
// POST /risk-approvals - Create risk approval
router.post(
  '/',
  authenticate,
  hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER']),
  validate(createRiskApprovalSchema),
  riskApprovalController.createRiskApproval,
);

// GET /risk-approvals - Get all risk approvals
router.get('/', authenticate, hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER']), riskApprovalController.getRiskApprovals);

// GET /risk-approvals/:id - Get risk approval by ID
router.get('/:id', authenticate, hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER']), riskApprovalController.getRiskApprovalById);

// PATCH /risk-approvals/:id - Update risk approval status
router.patch(
  '/:id',
  authenticate,
  hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER']),
  validate(updateRiskApprovalSchema),
  riskApprovalController.updateRiskApproval,
);

// DELETE /risk-approvals/:id - Delete risk approval
router.delete(
  '/:id',
  authenticate,
  hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER']),
  riskApprovalController.deleteRiskApproval,
);

export default router;
