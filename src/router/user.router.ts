/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-default-export */

import { type Router } from 'express';
import express from 'express';

import { userController } from '../controllers/user';
import { validate } from '../middleware';
import passport from '../strategy/jwt-strategy';
import { registerUserJoiSchema, loginUserJoiSchema } from '../validators';

const router: Router = express.Router();

/**
 * Public Routes (No Authentication)
 */

// POST /users/register - Register user baru
router.post('/register', validate(registerUserJoiSchema), userController.registerUser);

// POST /users/login - Login user
router.post('/login', validate(loginUserJoiSchema), userController.loginUser);

/**
 * Protected Routes (Require Authentication)
 */

// GET /users/:userId - Get user profile
router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  userController.getUserProfile,
);

export default router;
