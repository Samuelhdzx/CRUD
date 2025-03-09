const Usuario = require('../models/usuario.model');

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('nombre email');
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.save();
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear usuario', error: error.message });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar usuario', error });
    }
};
