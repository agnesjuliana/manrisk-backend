/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { organizationController } from '../controllers';
import { organizationAuthController } from '../controllers/organization/auth-organization.controller';
import { validate } from '../middleware';
import passport from '../strategy/jwt-strategy';
import {
  registerOrganizationJoiSchema,
  updateOrganizationJoiSchema,
  manageDivisionJoiSchema,
  manageUserJoiSchema,
} from '../validators';

const router: Router = express.Router();

// POST /organizations/register - Register/upsert organization (Protected, Admin only)
router.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  validate(registerOrganizationJoiSchema),
  organizationAuthController.registerOrganization,
);

// Get organization profile
router.get(
  '/:organizationId',
  passport.authenticate('jwt', { session: false }),
  organizationController.getOrganizationProfile,
);

// Update organization profile
router.put(
  '/:organizationId',
  passport.authenticate('jwt', { session: false }),
  validate(updateOrganizationJoiSchema),
  organizationController.updateOrganizationProfile,
);

// ===== DEPARTMENT MANAGEMENT =====

// Create department
router.post(
  '/:organizationId/departments',
  passport.authenticate('jwt', { session: false }),
  validate(manageDivisionJoiSchema.create),
  organizationController.createDepartment,
);

// Get all departments
router.get(
  '/:organizationId/departments',
  passport.authenticate('jwt', { session: false }),
  organizationController.getDepartments,
);

// Update department
router.put(
  '/:organizationId/departments/:departmentId',
  passport.authenticate('jwt', { session: false }),
  validate(manageDivisionJoiSchema.update),
  organizationController.updateDepartment,
);

// Delete department
router.delete(
  '/:organizationId/departments/:departmentId',
  passport.authenticate('jwt', { session: false }),
  organizationController.deleteDepartment,
);

// ===== USER MANAGEMENT =====

// Create user
router.post(
  '/:organizationId/users',
  passport.authenticate('jwt', { session: false }),
  validate(manageUserJoiSchema),
  organizationController.createUser,
);

// Get all users in organization
router.get(
  '/:organizationId/users',
  passport.authenticate('jwt', { session: false }),
  organizationController.getUsersInOrganization,
);

// Update user
router.put(
  '/:organizationId/users/:userId',
  passport.authenticate('jwt', { session: false }),
  validate(manageUserJoiSchema),
  organizationController.updateUser,
);

// Delete user
router.delete(
  '/:organizationId/users/:userId',
  passport.authenticate('jwt', { session: false }),
  organizationController.deleteUser,
);

export default router;
