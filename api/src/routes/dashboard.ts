import { Router } from 'express'
import { User } from '../models/User.js'
import { Project } from '../models/Project.js'
import { Task } from '../models/Task.js'
import { Comment } from '../models/Comment.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

/** Convert an aggregation `{ _id, count }[]` into a `{ key: count }` map. */
function toCountMap(rows: Array<{ _id: string | null; count: number }>): Record<string, number> {
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row._id ?? 'unassigned'] = row.count
    return acc
  }, {})
}

// GET /api/dashboard — aggregate statistics across the whole application
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [
      userCount,
      projectCount,
      taskCount,
      commentCount,
      tasksByStatus,
      tasksByPriority,
      projectsByStatus,
      recentTasks,
      recentProjects,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Task.countDocuments(),
      Comment.countDocuments(),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('project', 'name')
        .populate('assignee', 'name'),
      Project.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'name'),
    ])

    res.json({
      totals: {
        users: userCount,
        projects: projectCount,
        tasks: taskCount,
        comments: commentCount,
      },
      tasksByStatus: toCountMap(tasksByStatus),
      tasksByPriority: toCountMap(tasksByPriority),
      projectsByStatus: toCountMap(projectsByStatus),
      recent: {
        tasks: recentTasks,
        projects: recentProjects,
      },
    })
  })
)

export default router
