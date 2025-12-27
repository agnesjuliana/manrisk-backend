/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { assetTypeController, assetClassificationController, assetController } from '../controllers/asset';
import { authenticate, hasAccess, validate } from '../middleware';
import { createAssetSchema, updateAssetSchema } from '../validators/asset/asset.validator';

const router: Router = express.Router();

// Asset Type Routes
// GET /assets/types - Get asset types (Protected, all roles can read)
router.get('/types', authenticate, assetTypeController.getAssetTypes);

// Asset Classification Routes
// GET /assets/classifications - Get asset classifications (Protected, all roles can read)
router.get('/classifications', authenticate, assetClassificationController.getAssetClassifications);

// Asset CRUD Routes
// POST /assets - Create asset (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.post(
  '/',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(createAssetSchema),
  assetController.createAsset,
);

// GET /assets - Get all assets (Protected, all roles can read own organization)
router.get('/', authenticate, assetController.getAssets);

// GET /assets/:id - Get asset by ID (Protected, all roles can read own organization)
router.get('/:id', authenticate, assetController.getAssetById);

// PATCH /assets/:id - Update asset (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(updateAssetSchema),
  assetController.updateAsset,
);

// DELETE /assets/:id - Delete asset (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  assetController.deleteAsset,
);

export default router;
