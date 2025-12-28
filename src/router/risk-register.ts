/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { riskCategoryController, riskRegisterController, riskSourceController } from '../controllers/risk-register';
import { authenticate, validate } from '../middleware';
import { createRiskRegisterSchema, updateRiskRegisterSchema } from '../validators/risk-register';

const router: Router = express.Router();

// Risk Category Routes
router.get('/category', authenticate, riskCategoryController.getRiskCategories);

// Risk Source Routes
router.get('/source', authenticate, riskSourceController.getRiskSources);

// Risk Register CRUD Routes
// POST /risk-registers - Create risk register
router.post(
  '/',
  authenticate,
  validate(createRiskRegisterSchema),
  riskRegisterController.createRiskRegister,
);

// GET /risk-registers - Get all risk registers
router.get('/', authenticate, riskRegisterController.getRiskRegisters);

// GET /risk-registers/:id - Get risk register by ID
router.get('/:id', authenticate, riskRegisterController.getRiskRegisterById);

// PATCH /risk-registers/:id - Update risk register
router.patch(
  '/:id',
  authenticate,
  validate(updateRiskRegisterSchema),
  riskRegisterController.updateRiskRegister,
);

// DELETE /risk-registers/:id - Delete risk register
router.delete('/:id', authenticate, riskRegisterController.deleteRiskRegister);

export default router;
