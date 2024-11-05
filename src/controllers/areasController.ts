import { Request, Response } from 'express';
import pool from '../models/db';
import { ReqUser } from '../middlewares/authMiddleware';
import { renewTokenIfNeeded } from '../utils/renew';

// Obtener todos los roles
export const getAreas = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    try {
        const roles = await pool.query('SELECT * FROM section WHERE status = 1');
        renewTokenIfNeeded(req, res);
        res.json(roles.rows);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

// Obtener un rol por ID
export const getRoleById = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const role = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
        if (role.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(role.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

// Crear un nuevo rol
export const createRole = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { nombre } = req.body;
    try {
        const newRole = await pool.query(
            'INSERT INTO roles (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );
        res.status(201).json(newRole.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

// Actualizar un rol existente
export const updateRole = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const updatedRole = await pool.query(
            'UPDATE roles SET nombre = $1 WHERE id = $2 RETURNING *',
            [nombre, id]
        );
        if (updatedRole.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(updatedRole.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

// Eliminar un rol
export const deleteRole = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json({ message: 'Rol eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};
