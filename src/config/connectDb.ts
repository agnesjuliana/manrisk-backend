/* eslint-disable unicorn/filename-case */
/* eslint-disable import/no-default-export */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/prevent-abbreviations */
import { PrismaClient } from '@prisma/client';

declare global {
  var _db: PrismaClient | undefined;
}

if (!globalThis._db) {
  globalThis._db = new PrismaClient();
}

const db: PrismaClient = globalThis._db;

export default db;
