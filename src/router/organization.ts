/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { organizationController } from '../controllers/organization';
import { validate, checkRole } from '../middleware';
import passport from '../strategy/jwt-strategy';
import { upsertOrganizationJoiSchema } from '../validators';

const router: Router = express.Router();

// POST /organizations - Upsert organization (Protected, ADMIN only)
router.post(
  '',
  passport.authenticate('jwt', { session: false }),
  checkRole('ADMIN'),
  validate(upsertOrganizationJoiSchema),
  organizationController.upsertOrganization,
);

export default router;
