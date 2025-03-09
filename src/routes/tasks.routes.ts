import { Router } from 'express';
import { check } from 'express-validator';
import { sanitizeAndValidate } from '../middleware/validator.middleware';
import { createTask, updateTask, deleteTask, getTask, getAllTasks } from '../controllers/task.controller';

const router = Router();

const taskValidations = [
    check('title')
        .notEmpty().withMessage('El título es requerido')
        .isString().withMessage('El título debe ser texto')
        .isLength({ min: 1, max: 100 }).withMessage('El título debe tener entre 1 y 100 caracteres')
        .customSanitizer(value => {
            return value.replace(/<[^>]*>/g, ''); // Eliminar cualquier tag HTML
        }),
    
    check('description')
        .optional()
        .isString().withMessage('La descripción debe ser texto')
        .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres')
        .customSanitizer(value => {
            return value.replace(/<[^>]*>/g, ''); // Eliminar cualquier tag HTML
        }),
    
    sanitizeAndValidate
];

// Aplicar validaciones específicas para cada ruta
router.post('/', taskValidations, createTask);
router.put('/:id', taskValidations, updateTask);
router.patch('/:id', taskValidations, updateTask);
router.delete('/:id', sanitizeAndValidate, deleteTask);
router.get('/:id', sanitizeAndValidate, getTask);
router.get('/', getAllTasks);

export default router;
