import express, { type Router } from 'express';

import { UploadFileController } from '../controllers/upload-file.controller';
import { uploadFileMiddleware } from '../middleware/upload-file.middleware';

const router: Router = express.Router();

router.post('', uploadFileMiddleware.single('file'), UploadFileController);

// eslint-disable-next-line import/no-default-export
export default router;
