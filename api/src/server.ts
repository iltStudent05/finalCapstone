import { app } from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

/**
 * Application entry point: connect to MongoDB, then start listening.
 */
async function start(): Promise<void> {
  await connectDB()

  app.listen(env.port, () => {
    console.log(`🚀 API server running on http://localhost:${env.port}`)
    console.log(`   Health check: http://localhost:${env.port}/api/health`)
  })
}

start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
