import { Request, Response, NextFunction } from 'express'
import { ZodTypeAny, ZodError } from 'zod'

/**
 * Build a middleware that validates `req.body` against a Zod schema.
 * On success the parsed (and coerced) data replaces `req.body`.
 * On failure it responds with 400 and a flattened list of field errors.
 */
export function validate(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.flatten().fieldErrors,
        })
        return
      }
      next(error)
    }
  }
}
