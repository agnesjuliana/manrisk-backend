/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { organizationController } from '../controllers/organization';
import { validate, authenticate, hasAccess } from '../middleware';
import { upsertOrganizationJoiSchema } from '../validators';

const router: Router = express.Router();

// POST /organizations - Upsert organization (Protected, ADMIN only)
router.post(
  '',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER']),
  validate(upsertOrganizationJoiSchema),
  organizationController.upsertOrganization,
);

export default router;
