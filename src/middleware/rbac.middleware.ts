import { type Role } from '@prisma/client';
import { type NextFunction, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { type IRequestUser } from './authentication.middleware';
import { CustomError } from './error.middleware';

// ============ PERMISSION TYPES ============
export enum RBACAction {
  // Asset Management
  CREATE_ASSET = 'CREATE_ASSET',
  VIEW_ASSET = 'VIEW_ASSET',
  UPDATE_ASSET = 'UPDATE_ASSET',
  APPROVE_ASSET = 'APPROVE_ASSET',
  DELETE_ASSET = 'DELETE_ASSET',

  // Risk Management
  CREATE_RISK = 'CREATE_RISK',
  VIEW_RISK = 'VIEW_RISK',
  UPDATE_RISK = 'UPDATE_RISK',
  APPROVE_RISK = 'APPROVE_RISK',
  DELETE_RISK = 'DELETE_RISK',

  // Treatment Management
  CREATE_TREATMENT = 'CREATE_TREATMENT',
  VIEW_TREATMENT = 'VIEW_TREATMENT',
  UPDATE_TREATMENT = 'UPDATE_TREATMENT',
  APPROVE_TREATMENT = 'APPROVE_TREATMENT',
  DELETE_TREATMENT = 'DELETE_TREATMENT',

  // Control Management
  VIEW_CONTROL = 'VIEW_CONTROL',
  MANAGE_CONTROL = 'MANAGE_CONTROL',

  // SOA (Statement of Applicability)
  VIEW_SOA = 'VIEW_SOA',
  MANAGE_SOA = 'MANAGE_SOA',

  // System Administration
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ORGANIZATION = 'MANAGE_ORGANIZATION',
  MANAGE_DEPARTMENT = 'MANAGE_DEPARTMENT',
  VIEW_AUDIT_TRAIL = 'VIEW_AUDIT_TRAIL',
}

// ============ ROLE-BASED PERMISSIONS ============
export const ROLE_PERMISSIONS: Record<Role, Set<RBACAction>> = {
  ADMIN: new Set([
    // Admin dapat semua action
    RBACAction.CREATE_ASSET,
    RBACAction.VIEW_ASSET,
    RBACAction.UPDATE_ASSET,
    RBACAction.APPROVE_ASSET,
    RBACAction.DELETE_ASSET,
    RBACAction.CREATE_RISK,
    RBACAction.VIEW_RISK,
    RBACAction.UPDATE_RISK,
    RBACAction.APPROVE_RISK,
    RBACAction.DELETE_RISK,
    RBACAction.CREATE_TREATMENT,
    RBACAction.VIEW_TREATMENT,
    RBACAction.UPDATE_TREATMENT,
    RBACAction.APPROVE_TREATMENT,
    RBACAction.DELETE_TREATMENT,
    RBACAction.VIEW_CONTROL,
    RBACAction.MANAGE_CONTROL,
    RBACAction.VIEW_SOA,
    RBACAction.MANAGE_SOA,
    RBACAction.MANAGE_USERS,
    RBACAction.MANAGE_ORGANIZATION,
    RBACAction.MANAGE_DEPARTMENT,
    RBACAction.VIEW_AUDIT_TRAIL,
  ]),

  RISK_MANAGER: new Set([
    // Risk Manager dapat manage risiko dan treatment
    RBACAction.CREATE_ASSET,
    RBACAction.VIEW_ASSET,
    RBACAction.UPDATE_ASSET,
    RBACAction.CREATE_RISK,
    RBACAction.VIEW_RISK,
    RBACAction.UPDATE_RISK,
    RBACAction.CREATE_TREATMENT,
    RBACAction.VIEW_TREATMENT,
    RBACAction.UPDATE_TREATMENT,
    RBACAction.VIEW_CONTROL,
    RBACAction.MANAGE_CONTROL,
    RBACAction.VIEW_SOA,
    RBACAction.MANAGE_SOA,
    RBACAction.APPROVE_RISK,
    RBACAction.VIEW_AUDIT_TRAIL,
  ]),

  RISK_OWNER: new Set([
    // Risk Owner hanya bisa manage risiko yang dia own dan treatment terkait
    RBACAction.VIEW_ASSET,
    RBACAction.CREATE_RISK,
    RBACAction.VIEW_RISK,
    RBACAction.UPDATE_RISK,
    RBACAction.CREATE_TREATMENT,
    RBACAction.VIEW_TREATMENT,
    RBACAction.UPDATE_TREATMENT,
    RBACAction.VIEW_CONTROL,
    RBACAction.VIEW_SOA,
  ]),
};

// ============ MIDDLEWARE FUNCTIONS ============

/**
 * Check if user has permission to perform an action
 */
const checkPermissionMiddleware = (actions: RBACAction[]) => (request: IRequestUser, response: Response, next: NextFunction) => {
  const userRole = request.user?.role;

  if (!userRole) {
    return next(
      new CustomError(StatusCodes.UNAUTHORIZED, 'User role not found'),
    );
  }

  const userPermissions = ROLE_PERMISSIONS[userRole];
  const hasPermission = actions.some((action) => userPermissions.has(action));

  if (!hasPermission) {
    return next(
      new CustomError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to perform this action',
      ),
    );
  }

  return next();
};

export const checkPermission = checkPermissionMiddleware;

/**
 * Check if user is trying to access data within their organization/department
 * For Risk Owner: can only access risks in their department
 * For Risk Manager: can access all risks in their organization
 * For Admin: can access all data
 */
const checkDataAccessMiddleware = (request: IRequestUser, response: Response, next: NextFunction) => {
  const userRole = request.user?.role;
  const userId = request.user?.id;

  // Attach user metadata to request for later use in controllers
  if (!request.user) {
    request.user = {
      id: userId,
      name: '',
      email: '',
      password: '',
      role: userRole,
      is_email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  // Store access control info for use in service layer
  Object.assign(request, {
    accessControl: {
      userId,
      userRole,
      // These will be checked in service layer based on actual data
      canAccessAllOrganization: userRole === 'ADMIN',
      canAccessAllDepartment: userRole === 'ADMIN' || userRole === 'RISK_MANAGER',
    },
  });

  return next();
};

export const checkDataAccess = checkDataAccessMiddleware;

/**
 * Middleware to check if user is owner of a resource
 * For Risk Owner: check if user owns the risk
 * For Risk Manager: allow if same organization
 * For Admin: allow all
 */
const checkResourceOwnershipMiddleware =
  (getResourceOwnerId: (request: IRequestUser) => string) =>
  (request: IRequestUser, response: Response, next: NextFunction) => {
    const userRole = request.user?.role;
    const userId = request.user?.id;
    const resourceOwnerId = getResourceOwnerId(request);

    // Admin dan Risk Manager dapat access semua
    if (userRole === 'ADMIN' || userRole === 'RISK_MANAGER') {
      return next();
    }

    // Risk Owner hanya bisa access milik mereka sendiri
    if (userRole === 'RISK_OWNER' && userId !== resourceOwnerId) {
      return next(
        new CustomError(
          StatusCodes.FORBIDDEN,
          'You can only access resources you own',
        ),
      );
    }

    return next();
  };

export const checkResourceOwnership = checkResourceOwnershipMiddleware;

/**
 * Helper function untuk validate organization ownership
 * Memastikan user hanya bisa akses data dari organization mereka
 */
const validateOrganizationAccessMiddleware =
  (getOrganizationId: (request: IRequestUser) => string | undefined) =>
  (request: IRequestUser, response: Response, next: NextFunction) => {
    const userRole = request.user?.role;
    const organizationId = getOrganizationId(request);

    // Admin dapat access semua organization
    if (userRole === 'ADMIN') {
      return next();
    }

    // Non-admin harus punya organization
    if (!organizationId) {
      return next(
        new CustomError(
          StatusCodes.BAD_REQUEST,
          'Organization ID is required',
        ),
      );
    }

    return next();
  };

export const validateOrganizationAccess = validateOrganizationAccessMiddleware;

/**
 * Helper function untuk validate department access
 * Memastikan Risk Owner hanya bisa access risiko di department mereka
 */
const validateDepartmentAccessMiddleware =
  (getDepartmentId: (request: IRequestUser) => string | undefined) =>
  (request: IRequestUser, response: Response, next: NextFunction) => {
    const userRole = request.user?.role;
    const departmentId = getDepartmentId(request);

    // Admin dan Risk Manager dapat access semua department
    if (userRole === 'ADMIN' || userRole === 'RISK_MANAGER') {
      return next();
    }

    // Risk Owner harus di department yang benar
    if (userRole === 'RISK_OWNER' && !departmentId) {
      return next(
        new CustomError(
          StatusCodes.BAD_REQUEST,
          'Department ID is required for Risk Owner',
        ),
      );
    }

    return next();
  };

export const validateDepartmentAccess = validateDepartmentAccessMiddleware;
