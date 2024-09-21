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
exports.logout = exports.login = exports.deleteUsers = exports.updateUsers = exports.getUserById = exports.getUsers = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../models/db"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { nombre, correo, contrasena, rol_id } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(contrasena, 10);
    try {
        const result = yield db_1.default.query('INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES ($1, $2, $3, $4) RETURNING *', [nombre, correo, hashedPassword, rol_id]);
        res.status(201).json({ message: 'User created', data: result.rows[0].email });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.status(400).json({ error: 'Ocurrió un error desconocido' });
        }
    }
});
exports.register = register;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    try {
        const productos = yield db_1.default.query('SELECT * FROM usuarios');
        res.json(productos.rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.getUsers = getUsers;
// Obtener un usuario por ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.getUserById = getUserById;
// Actualizar un usuario existente
const updateUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    const { nombre, correo, contrasena, rol_id } = req.body;
    try {
        const result = yield db_1.default.query('UPDATE usuarios SET nombre = $1, correo= $2, contrasena= $3, rol_id= $4 WHERE id = $5 RETURNING *', [nombre, correo, contrasena, rol_id, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.updateUsers = updateUsers;
// Eliminar un usuario
const deleteUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    }
    catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
});
exports.deleteUsers = deleteUsers;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contrasena } = req.body;
    try {
        const result = yield db_1.default.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        const user = result.rows[0];
        if (!user)
            return res.status(400).json({ message: 'Credenciales invalidas' });
        const validPassword = yield bcryptjs_1.default.compare(contrasena, user.contrasena);
        if (!validPassword)
            return res.status(400).json({ message: 'Credenciales invalidas' });
        const token = jsonwebtoken_1.default.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });
        res.status(200).json({ message: 'Login' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.status(400).json({ error: 'Ocurrió un error desconocido' });
        }
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logout' });
});
exports.logout = logout;
