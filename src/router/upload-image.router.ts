import express, { type Router } from 'express';

import { UploadImageController } from '../controllers/upload-image.controller';
import { uploadImageMiddleware } from '../middleware/upload-image.middleware';

const router: Router = express.Router();

router.post('', uploadImageMiddleware.single('file'), UploadImageController);

// eslint-disable-next-line import/no-default-export
export default router;
