require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de seguridad básica
app.use(helmet());
app.use(mongoSanitize()); // Prevenir inyección NoSQL

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 peticiones por ventana
});
app.use('/api/', limiter);

// CSRF protection
app.use(csrf({ cookie: true }));

// Conexión segura a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    ssl: true,
    authSource: 'admin',
    retryWrites: true
});

// Middleware de validación
const validateRequest = (req, res, next) => {
    const { title, description } = req.body;
    if (!title || typeof title !== 'string' || title.length > 100) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }
    next();
};

// Rutas con protección
app.post('/api/tasks', validateRequest, async (req, res) => {
    try {
        // Implementar lógica de la ruta
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
