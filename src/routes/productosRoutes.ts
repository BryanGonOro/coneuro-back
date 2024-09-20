import { Router } from 'express';
import { createProductos, deleteProductos, getProductById, getProductos, updateProductos } from '../controllers/productosController';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRoles } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', verifyToken, checkRoles([2]), getProductos);

router.get('/:id', verifyToken, checkRoles([2]), getProductById);

router.post('/', verifyToken, checkRoles([2]), createProductos);

router.put('/:id', verifyToken, checkRoles([2]), updateProductos);

router.delete('/:id', verifyToken, checkRoles(), deleteProductos);

export default router;
