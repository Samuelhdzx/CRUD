const express = require('express');
const router = express.Router();
const adminAuthService = require('../services/adminAuth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// Ruta para registro de administradores
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await adminAuthService.registerAdmin(username, password);
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para login de administradores
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await adminAuthService.loginAdmin(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Ejemplo de ruta protegida
router.get('/dashboard', adminAuthMiddleware, (req, res) => {
    res.json({ message: 'Acceso concedido al panel de administración' });
});

module.exports = router;
