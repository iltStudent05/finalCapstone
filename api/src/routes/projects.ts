import { Router } from 'express'
import { z } from 'zod'
import { Project, PROJECT_STATUSES } from '../models/Project.js'
import { Task } from '../models/Task.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

const createSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  members: z.array(z.string()).optional(),
})

const updateSchema = createSchema.partial()

// GET /api/projects — list all (optional ?status= and ?owner= filters)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {}
    if (typeof req.query.status === 'string') filter.status = req.query.status
    if (typeof req.query.owner === 'string') filter.owner = req.query.owner

    const projects = await Project.find(filter)
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 })
    res.json(projects)
  })
)

// GET /api/projects/:id — get by id (populated)
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role')
    if (!project) throw new AppError(404, 'Project not found')
    res.json(project)
  })
)

// POST /api/projects — create (protected)
router.post(
  '/',
  requireAuth,
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const project = await Project.create({
      ...req.body,
      owner: req.user!.id,
    })
    res.status(201).json(project)
  })
)

// PUT /api/projects/:id — update (protected)
router.put(
  '/:id',
  requireAuth,
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!project) throw new AppError(404, 'Project not found')
    res.json(project)
  })
)

// DELETE /api/projects/:id — delete (protected, cascades to its tasks)
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) throw new AppError(404, 'Project not found')
    await Task.deleteMany({ project: project._id })
    res.json({ message: 'Project deleted', id: project._id })
  })
)

export default router
