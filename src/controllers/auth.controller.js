const Auth = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new Auth({
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error en registro:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (error.message === 'JWT_SECRET is not configured') {
            return res.status(500).json({ message: 'Error de configuración del servidor' });
        }
        res.status(500).json({ message: 'Error en el servidor' });
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

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
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
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        user.password = undefined;

        res.json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        console.error('Error en login:', error);
        if (error.message === 'JWT_SECRET is not configured') {
            return res.status(500).json({ message: 'Error de configuración del servidor' });
        }
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};
