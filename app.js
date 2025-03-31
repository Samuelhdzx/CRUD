require('dotenv').config();

// Add this after dotenv config and before other imports
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

console.log('✅ Environment variables loaded:', {
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET ? '[SET]' : '[NOT SET]',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
});

const express = require("express");
const mongoose = require("mongoose");
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const xss = require('xss-clean'); // Importar middleware xss-clean

// Importar rutas
const usuariosRouter = require('./src/routes/usuarios.routes');
const tareasRouter = require('./src/routes/tareas.routes');
const categoriasRouter = require('./src/routes/categorias.routes');
const authRouter = require('./src/routes/auth.routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Configuración de seguridad y middleware
app.use(helmet({
    contentSecurityPolicy: false // Temporalmente deshabilitado para desarrollo
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss()); // Usar middleware xss-clean

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/tareas', tareasRouter);
app.use('/api/categorias', categoriasRouter);

// Ruta para el frontend (debe ir después de las rutas API)
app.get('*', (req, res) => {
    // Ignorar solicitudes de favicon.ico
    if (req.url === '/favicon.ico') {
        res.status(204).end();
        return;
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejador de errores
app.use(errorHandler);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;