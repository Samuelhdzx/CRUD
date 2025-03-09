const express = require('express');
const router = express.Router();
const Tarea = require('../models/tarea.model');
const { 
    obtenerTareas, 
    obtenerTareasPorEstado, 
    crearTarea, 
    actualizarTarea, 
    eliminarTarea 
} = require('../controllers/tareaController');

router.get('/', obtenerTareas);
router.get('/estado/:estado', obtenerTareasPorEstado);
router.post('/', crearTarea);
router.get('/:id', async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener tarea', error: error.message });
    }
});
router.patch('/:id', async (req, res) => {
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
});
router.delete('/:id', eliminarTarea);

module.exports = router;
