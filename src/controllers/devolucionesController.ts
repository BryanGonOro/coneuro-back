import { Response } from 'express';
import pool from '../models/db';
import { ReqUser } from '../middlewares/authMiddleware';

export const getDevoluciones = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    try {
        const results = await pool.query('SELECT * FROM devoluciones');
        res.json(results.rows);
    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
    }
};


// Obtener un rol por ID
export const getDevolucionById = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM devoluciones WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Devolucion no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

// Crear un nuevo rol
export const createDevoluciones = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { nombre } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO devoluciones (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

// Actualizar un rol existente
export const updateDevoluciones = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const result = await pool.query(
            'UPDATE devoluciones SET nombre = $1 WHERE id = $2 RETURNING *',
            [nombre, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Devolucion no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

// Eliminar un rol
export const deleteDevoluciones = async (req: ReqUser, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM devoluciones WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Devolucion no encontrado' });
        }
        res.json({ message: 'Bodega eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error, intente de nuevo' });
    }
};

