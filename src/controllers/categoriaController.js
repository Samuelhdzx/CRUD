const Categoria = require('../models/categoria.model');

exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find().select('nombre color');
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
    }
};

exports.crearCategoria = async (req, res) => {
    try {
        const categoria = new Categoria(req.body);
        await categoria.save();
        res.status(201).json(categoria);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear categoría', error: error.message });
    }
};

exports.eliminarCategoria = async (req, res) => {
    try {
        await Categoria.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar categoría', error });
    }
};
