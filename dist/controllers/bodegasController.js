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
exports.deleteBodegas = exports.updateBodegas = exports.createBodegas = exports.getBodegaById = exports.getBodegas = void 0;
const db_1 = __importDefault(require("../models/db"));
const getBodegas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    try {
        const results = yield db_1.default.query('SELECT * FROM bodegas');
        res.json(results.rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
    }
});
exports.getBodegas = getBodegas;
// Obtener un rol por ID
const getBodegaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('SELECT * FROM bodegas WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Bodega no encontrado' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.getBodegaById = getBodegaById;
// Crear un nuevo rol
const createBodegas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { nombre } = req.body;
    try {
        const result = yield db_1.default.query('INSERT INTO bodegas (nombre) VALUES ($1) RETURNING *', [nombre]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.createBodegas = createBodegas;
// Actualizar un rol existente
const updateBodegas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const result = yield db_1.default.query('UPDATE bodegas SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Bodega no encontrado' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.updateBodegas = updateBodegas;
// Eliminar un rol
const deleteBodegas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('DELETE FROM bodegas WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Bodega no encontrado' });
        }
        res.json({ message: 'Bodega eliminada correctamente' });
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.deleteBodegas = deleteBodegas;
