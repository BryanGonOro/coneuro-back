"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolesController_1 = require("../controllers/rolesController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Obtener todos los roles
router.get('/', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), rolesController_1.getRoles);
// Obtener un rol por ID
router.get('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), rolesController_1.getRoleById);
// Crear un nuevo rol
router.post('/', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), rolesController_1.createRole);
// Actualizar un rol existente
router.put('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), rolesController_1.updateRole);
// Eliminar un rol
router.delete('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), rolesController_1.deleteRole);
exports.default = router;
