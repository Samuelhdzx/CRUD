const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../src/models/admin.model');

class AdminAuthService {
    async validateAdminPassword(password) {
        if (!password.endsWith('admin')) {
            throw new Error('La contraseña debe terminar con "admin"');
        }
        if (password.length < 10) {
            throw new Error('La contraseña debe tener al menos 10 caracteres');
        }
    }

    async registerAdmin(username, password) {
        await this.validateAdminPassword(password);
        
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            throw new Error('El nombre de usuario ya existe');
        }

        const admin = new Admin({ username, password });
        await admin.save();
        
        return { id: admin._id, username: admin.username };
    }

    async loginAdmin(username, password) {
        if (!password.endsWith('admin')) {
            throw new Error('Credenciales inválidas');
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            throw new Error('Credenciales inválidas');
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return { token, admin: { id: admin._id, username: admin.username } };
    }
}

module.exports = new AdminAuthService();
