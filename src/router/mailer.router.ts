/* eslint-disable @typescript-eslint/unbound-method */

/* eslint-disable import/no-default-export */
import { type Router } from 'express';
import express from 'express';

import { MailerController } from '../controllers';
import { validate } from '../middleware';
import { emailVerify } from '../validators';

const router: Router = express.Router();

router.post('/verify-email', validate(emailVerify), MailerController.verificationMail);
router.post(
  '/resend-verify-email',
  validate(emailVerify),
  MailerController.resendVerificationEmail,
);
router.get('/verify-email/:mailToken', MailerController.emailVerify);

export default router;
