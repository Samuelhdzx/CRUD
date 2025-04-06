const express = require('express');
const router = express.Router();
const adminAuthService = require('../services/adminAuth');
const adminAuthMiddleware = require('../middleware/adminAuth');

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await adminAuthService.registerAdmin(username, password);
        res.status(201).json({
            success: true,
            data: admin,
            message: 'Administrador registrado exitosamente'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await adminAuthService.loginAdmin(username, password);
        res.json({
            success: true,
            data: result,
            message: 'Login exitoso'
        });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
});

router.get('/dashboard', adminAuthMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Acceso concedido al panel de administración',
        admin: req.admin
    });
});

module.exports = router;
