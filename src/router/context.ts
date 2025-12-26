/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { contextController } from '../controllers/organization/context.controller';
import { validate, authenticate, hasAccess } from '../middleware';
import {
  createContextJoiSchema,
  updateContextJoiSchema,
} from '../validators/organization/context.validator';

const router: Router = express.Router();

// POST /contexts - Create context (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.post(
  '',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(createContextJoiSchema),
  contextController.createContext,
);

// GET /contexts - Get all contexts (Protected, all roles can read own organization)
router.get('', authenticate, contextController.getContexts);

// GET /contexts/:id - Get context by ID (Protected, all roles can read own organization)
router.get('/:id', authenticate, contextController.getContextById);

// PATCH /contexts/:id - Update context (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  validate(updateContextJoiSchema),
  contextController.updateContext,
);

// DELETE /contexts/:id - Delete context (Protected, ADMIN, RISK_MANAGER, TOP_MANAGEMENT only)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT'] as any),
  contextController.deleteContext,
);

export default router;
