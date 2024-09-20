import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';  
import { swaggerSpec } from './docs/swagger';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Configure CORS
app.use(cors({
    origin: ['http://localhost:3039', '*', 'https://bryangonoro.github.io/coneuro/'], // Allow the frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Ruta raíz
app.get('/', (req, res)=>{
    res.send("Bienvenido al API")
})
// Prefijo general para la API: /api/v1
app.use('/api/v1', apiRoutes);

// Ruta para la documentación con Swagger
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
