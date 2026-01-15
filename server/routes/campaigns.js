import express from 'express'
import { getDatabase } from '../database/init.js'
import { generateCampaignWithAI } from '../services/ai.js'

const router = express.Router()
const db = getDatabase()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' })
})

// Get all campaigns
router.get('/campaigns', (req, res) => {
  db.all('SELECT * FROM campaigns ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching campaigns:', err.message)
      return res.status(500).json({ error: 'Failed to fetch campaigns' })
    }
    res.json(rows)
  })
})

// Get single campaign by ID
router.get('/campaign/:id', (req, res) => {
  const { id } = req.params

  db.get('SELECT * FROM campaigns WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching campaign:', err.message)
      return res.status(500).json({ error: 'Failed to fetch campaign' })
    }

    if (!row) {
      return res.status(404).json({ error: 'Campaign not found' })
    }

    // Parse JSON strings back to objects
    const campaign = {
      ...row,
      marketing_plan: row.marketing_plan ? JSON.parse(row.marketing_plan) : null,
      email_assets: row.email_assets ? JSON.parse(row.email_assets) : null,
      whatsapp_assets: row.whatsapp_assets ? JSON.parse(row.whatsapp_assets) : null,
      social_assets: row.social_assets ? JSON.parse(row.social_assets) : null
    }

    res.json(campaign)
  })
})

// Create new campaign (with AI generation)
router.post('/generate-campaign', async (req, res) => {
  try {
    const {
      product_name,
      description,
      target_audience,
      launch_date,
      budget_range,
      industry,
      key_benefits
    } = req.body

    // Validate required fields
    if (!product_name || !description || !target_audience || !launch_date || !budget_range || !industry || !key_benefits) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Insert initial campaign record
    const campaignId = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO campaigns (
          product_name, description, target_audience, launch_date,
          budget_range, industry, key_benefits
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        product_name,
        description,
        target_audience,
        launch_date,
        budget_range,
        industry,
        key_benefits
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })

    // Return campaign ID immediately
    res.json({
      campaign_id: campaignId,
      status: 'generating',
      message: 'Campaign created. AI generation in progress...'
    })

    // Generate AI content asynchronously (don't await)
    generateCampaignWithAI(campaignId, req.body).catch(err => {
      console.error('Error generating AI content:', err)
    })

  } catch (error) {
    console.error('Error creating campaign:', error)
    res.status(500).json({ error: 'Failed to create campaign' })
  }
})

// Delete campaign
router.delete('/campaign/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM campaigns WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting campaign:', err.message)
      return res.status(500).json({ error: 'Failed to delete campaign' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Campaign not found' })
    }

    res.json({ message: 'Campaign deleted successfully' })
  })
})

export default router
