/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { soaController } from '../controllers/soa';
import { authenticate, hasAccess, validate } from '../middleware';
import { createSOASchema, updateSOASchema } from '../validators/soa';

const router: Router = express.Router();

// SOA CRUD Routes
// POST /soas - Create SOA (only RISK_MANAGER and TOP_MANAGEMENT)
router.post(
  '/',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(createSOASchema),
  soaController.createSOA,
);

// GET /soas - Get all SOAs (all roles)
router.get('/', authenticate, soaController.getSOAs);

// GET /soas/:id - Get SOA by ID (all roles)
router.get('/:id', authenticate, soaController.getSOAById);

// PATCH /soas/:id - Update SOA (only RISK_MANAGER and TOP_MANAGEMENT)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  validate(updateSOASchema),
  soaController.updateSOA,
);

// DELETE /soas/:id - Delete SOA (only RISK_MANAGER and TOP_MANAGEMENT)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['RISK_MANAGER', 'TOP_MANAGEMENT']),
  soaController.deleteSOA,
);

export default router;
