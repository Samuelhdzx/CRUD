const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');

exports.protect = async (req, res, next) => {
    try {
        // 1) Verificar si el token existe
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                message: 'No estás autorizado para acceder a esta ruta'
            });
        }

        // 2) Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Verificar si el usuario existe
        const user = await Auth.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: 'El usuario de este token ya no existe'
            });
        }

        // Otorgar acceso a la ruta protegida
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Token inválido o expirado'
        });
    }
};
