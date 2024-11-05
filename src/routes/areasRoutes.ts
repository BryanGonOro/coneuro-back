import { Router } from 'express';
import { 
    getAreas, 
    getRoleById, 
    createRole, 
    updateRole, 
    deleteRole 
} from '../controllers/areasController';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRoles } from '../middlewares/roleMiddleware';

const router = Router();

// Obtener todos los roles
router.get('/', verifyToken, checkRoles(), getAreas);

// Obtener un rol por ID
router.get('/:id', verifyToken, checkRoles(), getRoleById);

// Crear un nuevo rol
router.post('/', verifyToken, checkRoles(), createRole);

// Actualizar un rol existente
router.put('/:id', verifyToken, checkRoles(), updateRole);

// Eliminar un rol
router.delete('/:id', verifyToken, checkRoles(), deleteRole);

export default router;
