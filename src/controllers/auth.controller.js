const Auth = require('../models/auth.model');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Por favor proporcione email y contraseña'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Por favor proporcione un email válido'
            });
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Auth.findOne({ email }).maxTimeMS(15000);
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'El email ya está registrado'
            });
        }

        // Crear nuevo usuario
        const user = new Auth({ email, password });
        await user.save();

        // Generar token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Eliminar password de la respuesta
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            status: 'success',
            token,
            data: { user: userResponse }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al registrar usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Por favor proporcione email y contraseña'
            });
        }

        const user = await Auth.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: 'Email o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        user.password = undefined;

        res.json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};
