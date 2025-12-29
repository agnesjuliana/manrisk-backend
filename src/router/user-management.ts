/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { userManagementController } from '../controllers/organization/user-management.controller';
import { validate, authenticate, hasAccess } from '../middleware';
import {
  createUserManagementJoiSchema,
  updateUserManagementJoiSchema,
} from '../validators/organization/user-management.validator';

const router: Router = express.Router();

// POST /user-management - Create user (Protected, ADMIN only)
router.post(
  '',
  authenticate,
  hasAccess(['ADMIN']),
  validate(createUserManagementJoiSchema),
  userManagementController.createUser,
);

// GET /user-management - Get all users (Protected, ADMIN and RISK_MANAGER)
router.get(
  '',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER', 'TOP_MANAGEMENT']),
  userManagementController.getUsers,
);

// GET /user-management/:id - Get user by ID (Protected, ADMIN and RISK_MANAGER)
router.get(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER']),
  userManagementController.getUserById,
);

// PATCH /user-management/:id - Update user (Protected, ADMIN only)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['ADMIN']),
  validate(updateUserManagementJoiSchema),
  userManagementController.updateUser,
);

// DELETE /user-management/:id - Delete user (Protected, ADMIN only)
router.delete(
  '/:id',
  authenticate,
  hasAccess(['ADMIN']),
  userManagementController.deleteUser,
);

export default router;
