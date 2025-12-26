/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { departmentController } from '../controllers/organization/department.controller';
import { validate, authenticate, hasAccess } from '../middleware';
import {
  createDepartmentJoiSchema,
  updateDepartmentJoiSchema,
} from '../validators/organization/department.validator';

const router: Router = express.Router();

// POST /departments - Create department (Protected, ADMIN only)
router.post(
  '',
  authenticate,
  hasAccess(['ADMIN']),
  validate(createDepartmentJoiSchema),
  departmentController.createDepartment,
);

// GET /departments - Get all departments (Protected, ADMIN and RISK_MANAGER)
router.get(
  '',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER']),
  departmentController.getDepartments,
);

// GET /departments/:id - Get department by ID (Protected, ADMIN and RISK_MANAGER)
router.get(
  '/:id',
  authenticate,
  hasAccess(['ADMIN', 'RISK_MANAGER']),
  departmentController.getDepartmentById,
);

// PATCH /departments/:id - Update department (Protected, ADMIN only)
router.patch(
  '/:id',
  authenticate,
  hasAccess(['ADMIN']),
  validate(updateDepartmentJoiSchema),
  departmentController.updateDepartment,
);

// DELETE /departments/:id - Delete department (Protected, ADMIN only)
router.delete('/:id', authenticate, hasAccess(['ADMIN']), departmentController.deleteDepartment);

export default router;
