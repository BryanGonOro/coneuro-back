import { Router } from 'express';
import authRoutes from './authRoutes';
import productosRoutes from './productosRoutes';
import rolesRoutes from './rolesRoutes';
import bodegasRoutes from './bodegasRoutes';
import despachosRoutes from './despachosRoutes';
import devolucionesRoutes from './devolucionesRoutes';
import existenciasRoutes from './existenciasRoutes';

const router = Router();

// Prefijo para todas las rutas de la API: api/v1
router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/tiposmovimiento', (req, res)=>{
    res.status(200).json({ message: 'Tipos Mov.'})
});
router.use('/tipossolicitud', (req, res)=>{
    res.status(200).json({ message: 'Tipos Sol.'})
});
router.use('/estados', (req, res)=>{
    res.status(200).json({ message: 'Estados'})
});
router.use('/productos', productosRoutes);
router.use('/bodegas', bodegasRoutes);
router.use('/despachos', despachosRoutes);
router.use('/devoluciones', devolucionesRoutes);
router.use('/existencias', existenciasRoutes);

export default router;
