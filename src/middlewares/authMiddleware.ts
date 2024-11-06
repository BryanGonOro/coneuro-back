import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';

export interface TokenPayload extends JwtPayload {
  id: number; // o string, dependiendo de tu implementación
  rol: number; // o string
}

export interface ReqUser extends Request {
  user?: TokenPayload;
  expire?: boolean;
}

export const verifyToken = (req: ReqUser, res: Response, next: NextFunction) => {
  const cookie = req.cookies.token;
  // console.log(cookie)
  // Verificar si el cookie existe y puede ser parseado
  if (!cookie) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  let data: { token: string; expireDate: number };
  try {
    data = JSON.parse(cookie);
  } catch {
    return res.status(403).json({ message: 'Formato de cookie inválido' });
  }

  // Verificar si el token está presente
  if (!data.token) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(data.token, process.env.JWT_SECRET!) as TokenPayload;
    const expMS = ms(process.env.JWT_EXPIRES_IN!);

    const diezMinutos = 10 * 60 * 1000;
    const tiempoRestante = data.expireDate - Date.now();

    console.log("EL DATO", tiempoRestante, "y", diezMinutos)

    if (tiempoRestante < diezMinutos) { // 5 minutos antes de expirar
      const token = jwt.sign({ id: decoded.id, rol: decoded.rol }, process.env.JWT_SECRET!, { expiresIn: '24h' });
      const nuevoExpira = Date.now() + 60000;
      res.cookie('token', JSON.stringify({ token, expireDate: nuevoExpira }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'lax',
        maxAge: expMS,
      });

    }
    // Asigna el usuario decodificado a la solicitud
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err);
    res.status(401).json({ message: 'Token inválido' });
  }
};