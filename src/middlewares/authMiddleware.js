const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded._id);
        if (!usuario) {
            throw new Error();
        }
        req.user = usuario; // Agregar usuario autenticado a req
        next();
    } catch (error) {
        res.status(401).json({ error: 'No autorizado' });
    }
};
