/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import {
  assetTypeController,
  assetClassificationController,
  assetController,
} from '../controllers/asset';
import { authenticate, validate } from '../middleware';
import { createAssetSchema, updateAssetSchema } from '../validators/asset/asset.validator';

const router: Router = express.Router();

// Asset Type Routes
// GET /assets/type - Get asset types (Protected, all roles can read)
router.get('/type', authenticate, assetTypeController.getAssetTypes);

// Asset Classification Routes
// GET /assets/classification - Get asset classifications (Protected, all roles can read)
router.get('/classification', authenticate, assetClassificationController.getAssetClassifications);

// Asset CRUD Routes
// POST /assets - Create asset (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.post('/', authenticate, validate(createAssetSchema), assetController.createAsset);

// GET /assets - Get all assets (Protected, all roles can read own organization)
router.get('/', authenticate, assetController.getAssets);

// GET /assets/:id - Get asset by ID (Protected, all roles can read own organization)
router.get('/:id', authenticate, assetController.getAssetById);

// PATCH /assets/:id - Update asset (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.patch('/:id', authenticate, validate(updateAssetSchema), assetController.updateAsset);

// DELETE /assets/:id - Delete asset (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.delete('/:id', authenticate, assetController.deleteAsset);

export default router;
