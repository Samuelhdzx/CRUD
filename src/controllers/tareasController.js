const Tarea = require('../models/Tarea');

// Crear tarea
exports.crearTarea = async (req, res) => {
    try {
        const tarea = new Tarea({
            ...req.body,
            usuario: req.user._id // Asociar la tarea al usuario autenticado
        });
        await tarea.save();
        res.status(201).json(tarea);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
};

// Obtener tareas
exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find({ usuario: req.user._id }) // Filtrar por usuario
            .populate('categoria_id', 'nombre'); // Opcional: popular categoría
        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};
