import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface ReqUser extends Request {
  user?: JwtPayload | string;
}

export const verifyToken = (req: ReqUser, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  console.log('Token recibido:', token);
  if (!token) return res.status(403).json({ message: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // console.log("DECO", decoded)
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalido' });
  }
};
