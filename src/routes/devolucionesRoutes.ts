import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRoles } from '../middlewares/roleMiddleware';
import { createDevoluciones, deleteDevoluciones, getDevolucionById, getDevoluciones, updateDevoluciones } from '../controllers/devolucionesController';

const router = Router();

router.get('/', verifyToken, checkRoles([2,3,4]), getDevoluciones);

router.get('/:id', verifyToken, checkRoles([2,3,4]), getDevolucionById);

router.post('/', verifyToken, checkRoles([2,3,4]), createDevoluciones);

router.put('/:id', verifyToken, checkRoles([2,3,4]), updateDevoluciones);

router.delete('/:id', verifyToken, checkRoles([2,3,4]), deleteDevoluciones);

export default router;
