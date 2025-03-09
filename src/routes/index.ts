import { Router } from 'express';
import taskRoutes from './tasks.routes';

const router = Router();

// Montar las rutas específicas
router.use('/tasks', taskRoutes);

export default router;
