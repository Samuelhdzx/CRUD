const express = require('express');
const router = express.Router();
const Tarea = require('../models/tarea.model');
const authMiddleware = require('../middleware/auth.middleware');
const { 
    obtenerTareasPorEstado, 
    crearTarea, 
    actualizarTarea, 
    eliminarTarea 
} = require('../controllers/tareaController');

router.use(authMiddleware); // Protege todas las rutas de tareas

router.get('/', async (req, res) => {
    try {
        const tareas = await Tarea.find({ usuario_id: req.userId });
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

router.get('/estado/:estado', obtenerTareasPorEstado);
router.post('/', authMiddleware, async (req, res) => {
    try {
        const nuevaTarea = new Tarea({
            ...req.body,
            usuario_id: req.userId
        });
        
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la tarea', error: error.message });
    }
});
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
