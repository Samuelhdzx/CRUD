import { Router } from 'express';
import { validateRequest } from '../middleware/validator.middleware';
import { check } from 'express-validator';

const router = Router();

// Ejemplo de validación para una ruta de creación
router.post('/resource',
  [
    check('name').trim().escape().notEmpty(),
    check('email').isEmail().normalizeEmail(),
    check('description').trim().escape()
  ],
  validateRequest,
  yourControllerFunction
);

export default router;