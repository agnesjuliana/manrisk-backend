/* eslint-disable @typescript-eslint/unbound-method */

/* eslint-disable import/no-default-export */
import { type Router } from 'express';
import express from 'express';

import { StorageController } from '../controllers';

const router: Router = express.Router();

router.get('/storage/file/:file_name', StorageController.getFile);

export default router;
