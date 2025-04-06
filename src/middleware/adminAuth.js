const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Acceso denegado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado - Se requieren privilegios de administrador' });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            throw new Error();
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = adminAuthMiddleware;
