import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Placeholder routes - will be implemented in Phase 3
app.get('/api/', (req, res) => {
  res.json({ 
    message: 'Project Task Tracker API',
    version: '1.0.0',
    status: 'running'
  })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health`)
})
