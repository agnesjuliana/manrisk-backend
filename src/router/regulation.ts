/* eslint-disable @typescript-eslint/unbound-method */
 

import { type Router } from 'express';
import express from 'express';

import { regulationController } from '../controllers/organization/regulation.controller';
import { validate, authenticate, hasAccess } from '../middleware';
import {
  createRegulationJoiSchema,
  updateRegulationJoiSchema,
} from '../validators/organization/regulation.validator';

const router: Router = express.Router();

// Get All Regulations (Protected)
router.get('/', authenticate, regulationController.getRegulations);

// Get Regulation by ID (Protected)
router.get('/:id', authenticate, regulationController.getRegulationById);

// Create Regulation (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.post(
  '/',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(createRegulationJoiSchema),
  regulationController.createRegulation,
);

// Update Regulation (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(updateRegulationJoiSchema),
  regulationController.updateRegulation,
);

// Delete Regulation (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT']),
  regulationController.deleteRegulation,
);

export { router as regulationRouter };
