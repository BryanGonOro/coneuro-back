import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  id: number; // o string, dependiendo de tu implementación
  rol: number; // o string
}

export interface ReqUser extends Request {
  user?: TokenPayload;
  expire?: boolean;
}

export const verifyToken = (req: ReqUser, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  // console.log('Token recibido:', token);
  if (!token) return res.status(403).json({ message: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    req.expire = decoded.exp !== undefined && decoded.exp - now < 300; // Verifica si está a punto de expirar
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalido' });
  }
};
