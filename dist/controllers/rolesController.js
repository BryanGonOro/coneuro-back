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
exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoleById = exports.getRoles = void 0;
const db_1 = __importDefault(require("../models/db"));
// Obtener todos los roles
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    try {
        const roles = yield db_1.default.query('SELECT * FROM roles');
        res.json(roles.rows);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.getRoles = getRoles;
// Obtener un rol por ID
const getRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const role = yield db_1.default.query('SELECT * FROM roles WHERE id = $1', [id]);
        if (role.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(role.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.getRoleById = getRoleById;
// Crear un nuevo rol
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { nombre } = req.body;
    try {
        const newRole = yield db_1.default.query('INSERT INTO roles (nombre) VALUES ($1) RETURNING *', [nombre]);
        res.status(201).json(newRole.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.createRole = createRole;
// Actualizar un rol existente
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const updatedRole = yield db_1.default.query('UPDATE roles SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
        if (updatedRole.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(updatedRole.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.updateRole = updateRole;
// Eliminar un rol
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json({ message: 'Rol eliminado correctamente' });
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.deleteRole = deleteRole;
