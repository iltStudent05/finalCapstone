import { Request, Response, NextFunction } from 'express'

/**
 * Application-level HTTP error. Throw (or pass to `next`) an AppError to
 * produce a consistent JSON error response with an explicit status code.
 */
export class AppError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
    Error.captureStackTrace?.(this, AppError)
  }
}

/** 404 handler for unmatched routes. */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` })
}

/**
 * Centralized error handler. Must keep all four arguments so Express
 * recognizes it as an error-handling middleware.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Known application errors
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, details: err.details })
    return
  }

  // Mongoose validation errors -> 400
  if (err && typeof err === 'object' && (err as { name?: string }).name === 'ValidationError') {
    res.status(400).json({ error: 'Validation failed', details: err })
    return
  }

  // Duplicate key (e.g. unique email) -> 409
  if (err && typeof err === 'object' && (err as { code?: number }).code === 11000) {
    res.status(409).json({ error: 'Duplicate value', details: (err as { keyValue?: unknown }).keyValue })
    return
  }

  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
}
