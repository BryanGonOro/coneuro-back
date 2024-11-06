import { Router } from 'express';
import { register, login, logout, getUsers, getUserById, updateUsers, deleteUsers } from '../controllers/authController';
import limiter from '../utils/limiter';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRoles } from '../middlewares/roleMiddleware';

const router = Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Crear un nuevo usuario (Solo admin)
 *     security:
 *       - cookieAuth: []  # Usar la autenticación basada en cookies
 *     requestBody:
 *       description: Datos del usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               rol:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en el registro
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado, solo administradores pueden crear usuarios
 */
router.post('/register', verifyToken, checkRoles(), register);

router.get('/users', verifyToken, checkRoles(), getUsers);
router.get('/:id', verifyToken, checkRoles(), getUserById);
router.put('/:id', verifyToken, checkRoles([2]), updateUsers);
router.delete('/:id', verifyToken, checkRoles(), deleteUsers);




/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     requestBody:
 *       description: Credenciales de inicio de sesión
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Error en el inicio de sesión
 */
router.post('/login', login);
// router.post('/login', limiter, login);


router.post('/logout', logout);

export default router;
