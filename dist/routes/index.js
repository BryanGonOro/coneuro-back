"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const productosRoutes_1 = __importDefault(require("./productosRoutes"));
const rolesRoutes_1 = __importDefault(require("./rolesRoutes"));
const bodegasRoutes_1 = __importDefault(require("./bodegasRoutes"));
const despachosRoutes_1 = __importDefault(require("./despachosRoutes"));
const devolucionesRoutes_1 = __importDefault(require("./devolucionesRoutes"));
const existenciasRoutes_1 = __importDefault(require("./existenciasRoutes"));
const router = (0, express_1.Router)();
// Prefijo para todas las rutas de la API: api/v1
router.use('/auth', authRoutes_1.default);
router.use('/roles', rolesRoutes_1.default);
router.use('/tiposmovimiento', (req, res) => {
    res.status(200).json({ message: 'Tipos Mov.' });
});
router.use('/tipossolicitud', (req, res) => {
    res.status(200).json({ message: 'Tipos Sol.' });
});
router.use('/estados', (req, res) => {
    res.status(200).json({ message: 'Estados' });
});
router.use('/productos', productosRoutes_1.default);
router.use('/bodegas', bodegasRoutes_1.default);
router.use('/despachos', despachosRoutes_1.default);
router.use('/devoluciones', devolucionesRoutes_1.default);
router.use('/existencias', existenciasRoutes_1.default);
exports.default = router;
