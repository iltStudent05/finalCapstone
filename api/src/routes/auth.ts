import { Router } from 'express'
import { z } from 'zod'
import { User, USER_ROLES } from '../models/User.js'
import { signToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('A valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(USER_ROLES).optional(),
})

const loginSchema = z.object({
  email: z.string().email('A valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

/** Shape the user object sent back to clients (never include the password). */
function publicUser(user: { _id: unknown; name: string; email: string; role: string }) {
  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

// POST /api/auth/register
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      throw new AppError(409, 'An account with that email already exists')
    }

    const user = await User.create({ name, email, password, role })
    const token = signToken({ id: user._id.toString(), role: user.role })

    res.status(201).json({ token, user: publicUser(user) })
  })
)

// POST /api/auth/login
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // password has select:false, so request it explicitly for comparison
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      throw new AppError(401, 'Invalid email or password')
    }

    const valid = await user.comparePassword(password)
    if (!valid) {
      throw new AppError(401, 'Invalid email or password')
    }

    const token = signToken({ id: user._id.toString(), role: user.role })
    res.json({ token, user: publicUser(user) })
  })
)

export default router
