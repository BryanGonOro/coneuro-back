import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRoles } from '../middlewares/roleMiddleware';
import { createBodegas, deleteBodegas, getBodegaById, getBodegas, updateBodegas } from '../controllers/bodegasController';

const router = Router();

router.get('/', verifyToken, checkRoles([2]), getBodegas);

router.get('/:id', verifyToken, checkRoles(), getBodegaById);

router.post('/', verifyToken, checkRoles(), createBodegas);

router.put('/:id', verifyToken, checkRoles(), updateBodegas);

router.delete('/:id', verifyToken, checkRoles(), deleteBodegas);

export default router;
