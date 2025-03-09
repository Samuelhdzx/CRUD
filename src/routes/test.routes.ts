import { Router } from 'express';
import { validateRequest, sanitizeAndValidate, sanitizeInput } from '../middleware/validator.middleware';
import { check } from 'express-validator';

const router = Router();

router.post('/security-test',
  [
    check('input').trim().escape(),
  ],
  validateRequest,
  sanitizeAndValidate,
  sanitizeInput,

  (req, res) => {
    // Log la entrada original y la sanitizada
    console.log('Input original:', req.body.input);
    console.log('Input sanitizado:', req.body.input);
    res.json({ 
      sanitized: req.body.input,
      headers: req.headers,
      query: req.query
    });
  }
);

export default router;
