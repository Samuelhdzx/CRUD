const express = require('express');
const router = express.Router();
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
router.put('/:id', actualizarTarea);
router.delete('/:id', eliminarTarea);

module.exports = router;
