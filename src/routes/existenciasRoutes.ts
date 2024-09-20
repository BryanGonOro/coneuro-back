import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { createExistencias, deleteExistencias, getExistenciaById, getExistencias, updateExistencias } from '../controllers/existenciasController';
import { checkRoles } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', verifyToken, checkRoles([2]), getExistencias);

router.get('/:id', verifyToken, checkRoles([2]), getExistenciaById);

router.post('/', verifyToken, checkRoles([2]), createExistencias);

router.put('/:id', verifyToken, checkRoles([2]), updateExistencias);

router.delete('/:id', verifyToken, checkRoles(), deleteExistencias);

export default router;
