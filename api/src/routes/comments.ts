import { Router } from 'express'
import { z } from 'zod'
import { Comment } from '../models/Comment.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

const createSchema = z.object({
  body: z.string().min(1, 'Comment body is required'),
  task: z.string().min(1, 'A task id is required'),
})

const updateSchema = z.object({
  body: z.string().min(1, 'Comment body is required'),
})

// GET /api/comments — list (filter by ?task=)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {}
    if (typeof req.query.task === 'string') filter.task = req.query.task

    const comments = await Comment.find(filter)
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })
    res.json(comments)
  })
)

// GET /api/comments/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id).populate('author', 'name email role')
    if (!comment) throw new AppError(404, 'Comment not found')
    res.json(comment)
  })
)

// POST /api/comments — create (protected; author taken from the token)
router.post(
  '/',
  requireAuth,
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const comment = await Comment.create({
      ...req.body,
      author: req.user!.id,
    })
    res.status(201).json(comment)
  })
)

// PUT /api/comments/:id — update (protected)
router.put(
  '/:id',
  requireAuth,
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!comment) throw new AppError(404, 'Comment not found')
    res.json(comment)
  })
)

// DELETE /api/comments/:id — delete (protected)
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.id)
    if (!comment) throw new AppError(404, 'Comment not found')
    res.json({ message: 'Comment deleted', id: comment._id })
  })
)

export default router
