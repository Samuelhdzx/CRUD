require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Importar rutas
const usuariosRouter = require('./src/routes/usuarios.routes');
const tareasRouter = require('./src/routes/tareas.routes');
const categoriasRouter = require('./src/routes/categorias.routes');
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

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/usuarios', usuariosRouter);
app.use('/api/tareas', tareasRouter);
app.use('/api/categorias', categoriasRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

// Ruta para el frontend (debe ir después de las rutas API)
app.get('*', (req, res) => {
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