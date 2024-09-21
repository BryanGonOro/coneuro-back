import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db';
import { ReqUser } from '../middlewares/authMiddleware';

export const register = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { nombre, correo, contrasena, rol_id } = req.body;

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, correo, hashedPassword, rol_id]
        );
        res.status(201).json({ message: 'User created', data: result.rows[0].email});
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: 'Ocurrió un error desconocido' });
        }
    }
};

export const getUsers = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    try {
        const productos = await pool.query('SELECT * FROM usuarios');
        res.json(productos.rows);
    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error, intente de nuevo' });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};


// Actualizar un usuario existente
export const updateUsers = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    const { nombre, correo, contrasena, rol_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, correo= $2, contrasena= $3, rol_id= $4 WHERE id = $5 RETURNING *',
            [nombre, correo, contrasena, rol_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

// Eliminar un usuario
export const deleteUsers = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { correo, contrasena } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        const user = result.rows[0];

        if (!user) return res.status(400).json({ message: 'Credenciales invalidas' });

        const validPassword = await bcrypt.compare(contrasena, user.contrasena);
        if (!validPassword) return res.status(400).json({ message: 'Credenciales invalidas' });

        const token = jwt.sign({ id: user.id, rol: user.rol_id }, process.env.JWT_SECRET!, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000,
        });

        res.status(200).json({ message: 'Login' });
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: 'Ocurrió un error desconocido' });
        }
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });
    res.status(200).json({ message: 'Logout' });
}

