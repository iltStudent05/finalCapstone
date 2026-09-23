import { Router } from 'express'
import { z } from 'zod'
import { Task, TASK_STATUSES, TASK_PRIORITIES } from '../models/Task.js'
import { Comment } from '../models/Comment.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

const createSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  project: z.string().min(1, 'A project id is required'),
  assignee: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
})

const updateSchema = createSchema.partial()

// GET /api/tasks — list all (filters: ?project= ?status= ?priority= ?assignee=)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {}
    for (const key of ['project', 'status', 'priority', 'assignee'] as const) {
      const value = req.query[key]
      if (typeof value === 'string') filter[key] = value
    }

    const tasks = await Task.find(filter)
      .populate('project', 'name status')
      .populate('assignee', 'name email role')
      .sort({ createdAt: -1 })
    res.json(tasks)
  })
)

// GET /api/tasks/:id — get by id (populate references)
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name status')
      .populate('assignee', 'name email role')
    if (!task) throw new AppError(404, 'Task not found')
    res.json(task)
  })
)

// POST /api/tasks — create (protected)
router.post(
  '/',
  requireAuth,
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const task = await Task.create(req.body)
    res.status(201).json(task)
  })
)

// PUT /api/tasks/:id — update (protected)
router.put(
  '/:id',
  requireAuth,
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!task) throw new AppError(404, 'Task not found')
    res.json(task)
  })
)

// DELETE /api/tasks/:id — delete (protected, cascades to its comments)
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) throw new AppError(404, 'Task not found')
    await Comment.deleteMany({ task: task._id })
    res.json({ message: 'Task deleted', id: task._id })
  })
)

export default router
