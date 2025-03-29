const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const tareasRoutes = require('./routes/tareas.routes');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareasRoutes);

module.exports = app;