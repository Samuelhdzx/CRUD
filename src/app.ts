import express, { Express } from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import { securityConfig } from './config/security.config';
import { errorHandler } from './middleware/error.middleware';
import { authenticateToken } from './middleware/auth.middleware';
import { sanitizeAndValidate } from './middleware/validator.middleware';
import routes from './routes'; // Asegúrate de crear este archivo

const app: Express = express();

// 1. Middlewares básicos
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 2. Middlewares de seguridad
app.use(helmet());
app.use(securityConfig.cors);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(csrf({ cookie: true }));

// 3. Rate limiting
app.use('/api', securityConfig.rateLimiter);

// 4. Headers de seguridad
app.use((req, res, next) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// 5. Validación de Content-Type
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (!req.is('application/json')) {
            return res.status(415).json({ error: 'Unsupported Media Type' });
        }
    }
    next();
});

// Provide CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Aplicar sanitización global antes de las rutas
app.use(sanitizeAndValidate);

// Ruta básica para la raíz
app.get('/', (req, res) => {
    res.send('API is running');
});

// 6. Rutas de la API
app.use('/api', authenticateToken, routes);

// 7. Manejo de errores
app.use(errorHandler);

export default app;