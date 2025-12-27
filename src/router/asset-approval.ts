/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { assetApprovalController } from '../controllers/asset-approval';
import { authenticate, hasAccess, validate } from '../middleware';
import {
  createAssetApprovalSchema,
  updateAssetApprovalSchema,
} from '../validators/asset-approval';

const router: Router = express.Router();

// Asset Approval CRUD Routes
// POST /asset-approvals - Create asset approval (Protected, TOP_MANAGEMENT, RISK_MANAGER only)
router.post(
  '/',
  authenticate,
  hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER'] as any),
  validate(createAssetApprovalSchema),
  assetApprovalController.createAssetApproval,
);

// GET /asset-approvals - Get all asset approvals (Protected, TOP_MANAGEMENT, RISK_MANAGER only)
router.get(
  '/',
  authenticate,
  hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER'] as any),
  assetApprovalController.getAssetApprovals,
);

// GET /asset-approvals/:id - Get asset approval by ID (Protected, TOP_MANAGEMENT, RISK_MANAGER only)
router.get(
  '/:id',
  authenticate,
  hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER'] as any),
  assetApprovalController.getAssetApprovalById,
);

// PATCH /asset-approvals/:id - Update asset approval (Protected, TOP_MANAGEMENT, RISK_MANAGER only)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER'] as any),
  validate(updateAssetApprovalSchema),
  assetApprovalController.updateAssetApproval,
);

// DELETE /asset-approvals/:id - Delete asset approval (Protected, TOP_MANAGEMENT, RISK_MANAGER only)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['TOP_MANAGEMENT', 'RISK_MANAGER'] as any),
  assetApprovalController.deleteAssetApproval,
);

export default router;
