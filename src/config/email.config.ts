export const MAIL_CONFIG = {
  development: {
    EMAIL_USER: process.env.MAIL_USER || '',
    EMAIL_API: process.env.MAIL_API_KEY || '',
    EMAIL_DOMAIN: process.env.MAIL_DOMAIN || '',
    EMAIL_EXPIRES_IN: process.env.MAIL_EXPIRES_IN || '24h',
  },
  production: {
    EMAIL_USER: process.env.MAIL_USER || '',
    EMAIL_API: process.env.MAIL_API_KEY || '',
    EMAIL_DOMAIN: process.env.MAIL_DOMAIN || '',
    EMAIL_EXPIRES_IN: process.env.MAIL_EXPIRES_IN || '24h',
  },
};
