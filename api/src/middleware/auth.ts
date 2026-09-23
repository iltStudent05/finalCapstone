import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { UserRole } from '../models/User.js'
import { AppError } from './errorHandler.js'

/** Data encoded inside the JWT and attached to authenticated requests. */
export interface AuthPayload {
  id: string
  role: UserRole
}

// Augment Express's Request so `req.user` is strongly typed everywhere.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

/** Sign a JWT for a given user id + role. */
export function signToken(payload: AuthPayload): string {
  const options: jwt.SignOptions = { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  return jwt.sign(payload, env.jwtSecret, options)
}

/**
 * Verify the `Authorization: Bearer <token>` header and attach the decoded
 * payload to `req.user`. Rejects with 401 when missing or invalid.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    next(new AppError(401, 'Authentication required'))
    return
  }

  const token = header.slice('Bearer '.length)
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthPayload
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired token'))
  }
}

/**
 * Guard a route so only the given roles may proceed. Assumes `requireAuth`
 * has already run.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'Authentication required'))
      return
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError(403, 'Insufficient permissions'))
      return
    }
    next()
  }
}
