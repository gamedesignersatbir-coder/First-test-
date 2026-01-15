import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeDatabase } from './database/init.js'
import campaignRoutes from './routes/campaigns.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', campaignRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MiCA API Server',
    version: '0.1.0',
    endpoints: {
      health: '/api/health',
      campaigns: '/api/campaigns',
      generate: '/api/generate-campaign'
    }
  })
})

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase()
    console.log('Database initialized successfully')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`API available at http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
