"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log('Token recibido:', token);
    if (!token)
        return res.status(403).json({ message: 'Token requerido' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // console.log("DECO", decoded)
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token invalido' });
    }
};
exports.verifyToken = verifyToken;
