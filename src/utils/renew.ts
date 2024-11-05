import { ReqUser } from "../middlewares/authMiddleware";
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import ms from 'ms';

// Función para renovar el token
export const renewTokenIfNeeded = (req: ReqUser, res: Response) => {
    console.log("OJO ACA")
    if (req.expire) {
        console.log("TRUE EXPIRE")
        let expiresInMilliseconds = ms(process.env.JWT_EXPIRES_IN!);
        const newToken = jwt.sign(
            { id: req.user!.id, rol: req.user!.rol }, // Usar el operador de aserción no nulo
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN! }
        );

        console.log("newtoken", newToken)

        // Ajustar la duración a la hora de Colombia (UTC-5)
        const colombiaTimeOffset = -5 * 60 * 60 * 1000; // -5 horas en milisegundos
        const adjustedExpires = expiresInMilliseconds + colombiaTimeOffset;

        console.log("EXPIRACION", adjustedExpires)
        console.log(new Date(Date.now()))

        // Establecer cookie con el nuevo token
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'lax',
            maxAge: adjustedExpires, // 1 hora
        });

        console.log("Cookie renovada")
    }
};