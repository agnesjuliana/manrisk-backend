import express, { type Router } from 'express';

const router: Router = express.Router();

import passport from '../strategy/jwt-strategy';
import AuthRoutes from './auth.router';
import MailerRoutes from './mailer.router';
import SendFileRoutes from './send-file.router';
import SendImageRoutes from './send-image.router';
import UploadFileRoutes from './upload-file.router';
import UploadImageRoutes from './upload-image.router';

router.use('/auth', AuthRoutes);
router.use('/mailer', MailerRoutes);
router.use('/upload-file', UploadFileRoutes);
router.use('/upload-image', UploadImageRoutes);
router.use('/image', SendImageRoutes);
router.use('/file', SendFileRoutes);

router.use('/upload-file', passport.authenticate('jwt', { session: false }), UploadFileRoutes);
router.use('/upload-image', passport.authenticate('jwt', { session: false }), UploadImageRoutes);

// eslint-disable-next-line import/no-default-export
export default router;
