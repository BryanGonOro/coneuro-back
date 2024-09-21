"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const limiter_1 = __importDefault(require("../utils/limiter"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
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
router.post('/register', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), authController_1.register);
router.get('/users', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), authController_1.getUsers);
router.get('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), authController_1.getUserById);
router.put('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)([2]), authController_1.updateUsers);
router.delete('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), authController_1.deleteUsers);
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
router.post('/login', limiter_1.default, authController_1.login);
router.post('/logout', authController_1.logout);
exports.default = router;
