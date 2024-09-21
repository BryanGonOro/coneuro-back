"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const despachosController_1 = require("../controllers/despachosController");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)([2]), despachosController_1.getDespachos);
// router.get('/sinconfirmar', verifyToken, checkRoles([2]), getDespachos); //falta por hacer el ver que pedido estan sin confirmar, pero si se quiere se hace por estado y no devolver asi
router.get('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)([2]), despachosController_1.getDespachoById);
router.post('/', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)([2]), despachosController_1.createDespachos);
router.put('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)([2, 4]), despachosController_1.updateDespachos); // El update permite al asistente Confirmar un despacho como recibido o si se prefiere se hace un endpoint
router.delete('/:id', authMiddleware_1.verifyToken, (0, roleMiddleware_1.checkRoles)(), despachosController_1.deleteDespachos);
exports.default = router;
