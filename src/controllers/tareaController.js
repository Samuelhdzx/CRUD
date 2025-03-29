const Tarea = require('../models/tarea.model');

exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find()
            .populate('usuario_id', 'nombre')
            .populate('categoria_id', 'nombre color')
            .sort({ fecha_creacion: -1 });
        res.json(tareas);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ mensaje: 'Error al obtener tareas', error: error.message });
    }
};

exports.obtenerTareasPorEstado = async (req, res) => {
    try {
        const tareas = await Tarea.find({ estado: req.params.estado })
            .populate('usuario_id', 'nombre')
            .populate('categoria_id', 'nombre color');
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al filtrar tareas', error: error.message });
    }
};

exports.crearTarea = async (req, res) => {
    try {
        const nuevaTarea = new Tarea({
            ...req.body,
            usuario_id: req.userId // Agregamos el ID del usuario autenticado
        });
        
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la tarea', error: error.message });
    }
};

exports.actualizarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        
        tarea.estado = tarea.estado === 'completada' ? 'pendiente' : 'completada';
        await tarea.save();
        
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar tarea', error: error.message });
    }
};

exports.eliminarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findByIdAndDelete(req.params.id);
        if (!tarea) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        res.json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar tarea', error: error.message });
    }
};
