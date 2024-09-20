import { Router } from 'express';
import { 
    getRoles, 
    getRoleById, 
    createRole, 
    updateRole, 
    deleteRole 
} from '../controllers/rolesController';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRoles } from '../middlewares/roleMiddleware';

const router = Router();

// Obtener todos los roles
router.get('/', verifyToken, checkRoles(), getRoles);

// Obtener un rol por ID
router.get('/:id', verifyToken, checkRoles(), getRoleById);

// Crear un nuevo rol
router.post('/', verifyToken, checkRoles(), createRole);

// Actualizar un rol existente
router.put('/:id', verifyToken, checkRoles(), updateRole);

// Eliminar un rol
router.delete('/:id', verifyToken, checkRoles(), deleteRole);

export default router;
