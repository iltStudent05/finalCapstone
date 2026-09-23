import express, { Request, Response } from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import taskRoutes from './routes/tasks.js'
import commentRoutes from './routes/comments.js'
import dashboardRoutes from './routes/dashboard.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

/**
 * Build and configure the Express application.
 * Kept separate from `server.ts` so tests can import the app without
 * opening a network port or connecting to a database.
 */
export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  )

  // Health & info
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() })
  })

  app.get('/api', (_req: Request, res: Response) => {
    res.json({ message: 'Project Task Tracker API', version: '1.0.0', status: 'running' })
  })

  // Feature routes
  app.use('/api/auth', authRoutes)
  app.use('/api/projects', projectRoutes)
  app.use('/api/tasks', taskRoutes)
  app.use('/api/comments', commentRoutes)
  app.use('/api/dashboard', dashboardRoutes)

  // Fallbacks
  app.use(notFound)
  app.use(errorHandler)

  return app
}

export const app = createApp()
