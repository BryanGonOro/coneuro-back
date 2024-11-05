import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface ReqUser extends Request {
  user?: JwtPayload | string;
}


export function checkRoles(allowedRoleIds?: number[]) {
  return function (req: ReqUser, res: Response, next: NextFunction) {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (typeof req.user === 'string') {
      return res.status(403).json({ message: 'Token inválido' });
    }

    // Si no se especificaron roles permitidos, solo permitir al admin (rol === 1)
    if (!allowedRoleIds || allowedRoleIds.length === 0) {
      // console.log(req.user.rol )
      if (req.user.rol === 1) {
        return next();  // Si es admin, permitir acceso
      } else {
        return res.status(403).json({ error: 'No autorizado, solo admins permitidos' });
      }
    }

    // Verificar si el role_id del usuario está en la lista de IDs permitidos o si es admin (por ejemplo, role_id 1)
    if (allowedRoleIds.includes(req.user.rol) || req.user.rol === 1) {
      // Si el rol es permitido o el usuario es un admin, puede continuar
      return next();
    }

    // Si no tiene un rol permitido
    return res.status(403).json({ error: 'No autorizado' });
  };
}
