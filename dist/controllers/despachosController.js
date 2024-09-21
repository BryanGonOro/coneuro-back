"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDespachos = exports.updateDespachos = exports.createDespachos = exports.getDespachoById = exports.getDespachos = void 0;
const db_1 = __importDefault(require("../models/db"));
const getDespachos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    try {
        const results = yield db_1.default.query('SELECT * FROM despachos');
        res.json(results.rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
    }
});
exports.getDespachos = getDespachos;
// Obtener un rol por ID
const getDespachoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('SELECT * FROM despachos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Despachos no encontrado' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.getDespachoById = getDespachoById;
// Crear un nuevo rol
const createDespachos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { nombre } = req.body;
    try {
        const result = yield db_1.default.query('INSERT INTO despachos (nombre) VALUES ($1) RETURNING *', [nombre]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.createDespachos = createDespachos;
// Actualizar un rol existente
const updateDespachos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const result = yield db_1.default.query('UPDATE despachos SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Despachos no encontrado' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.updateDespachos = updateDespachos;
// Eliminar un rol
const deleteDespachos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('DELETE FROM despachos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Despachos no encontrado' });
        }
        res.json({ message: 'Despachos eliminada correctamente' });
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.deleteDespachos = deleteDespachos;
