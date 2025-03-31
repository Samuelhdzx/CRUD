const Auth = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
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
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error('Error en registro:', error);
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
