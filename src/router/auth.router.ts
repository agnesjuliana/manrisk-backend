/* eslint-disable @typescript-eslint/unbound-method */

/* eslint-disable import/no-default-export */
import { type Router } from 'express';
import express from 'express';

import { AuthController } from '../controllers';
import { validate, isAllowedRoles } from '../middleware';
import passport from '../strategy/jwt-strategy';
import { loginSchema, registerValidation } from '../validators';

const router: Router = express.Router();

router.post('/register', validate(registerValidation), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  isAllowedRoles(['ADMIN', 'USER']) as express.RequestHandler,
  AuthController.me,
);

export default router;
