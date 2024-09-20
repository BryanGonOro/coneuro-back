import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRoles } from '../middlewares/roleMiddleware';
import { createDespachos, deleteDespachos, getDespachoById, getDespachos, updateDespachos } from '../controllers/despachosController';

const router = Router();

router.get('/', verifyToken, checkRoles([2]), getDespachos);

// router.get('/sinconfirmar', verifyToken, checkRoles([2]), getDespachos); //falta por hacer el ver que pedido estan sin confirmar, pero si se quiere se hace por estado y no devolver asi

router.get('/:id', verifyToken, checkRoles([2]), getDespachoById);

router.post('/', verifyToken, checkRoles([2]), createDespachos);

router.put('/:id', verifyToken, checkRoles([2,4]), updateDespachos);  // El update permite al asistente Confirmar un despacho como recibido o si se prefiere se hace un endpoint

router.delete('/:id', verifyToken, checkRoles(), deleteDespachos);

export default router;
