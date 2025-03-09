import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { Express } from 'express';

export const configureSecurity = (app: Express) => {
  // Helmet - Security headers
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS)
  });
  app.use('/api', limiter);

  // Data sanitization against XSS
  app.use(xss());

  // Data sanitization against NoSQL injection
  app.use(mongoSanitize());

  // Prevent parameter pollution
  app.use(hpp());
};
