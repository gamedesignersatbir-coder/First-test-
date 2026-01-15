import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'mica.db')

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to SQLite database')
  }
})

// Initialize database schema
export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create campaigns table
      db.run(`
        CREATE TABLE IF NOT EXISTS campaigns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT DEFAULT 'demo_user',
          product_name TEXT NOT NULL,
          description TEXT NOT NULL,
          target_audience TEXT NOT NULL,
          launch_date TEXT NOT NULL,
          budget_range TEXT NOT NULL,
          industry TEXT NOT NULL,
          key_benefits TEXT NOT NULL,
          marketing_plan TEXT,
          email_assets TEXT,
          whatsapp_assets TEXT,
          social_assets TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating campaigns table:', err.message)
          reject(err)
        } else {
          console.log('Campaigns table ready')
          resolve()
        }
      })
    })
  })
}

// Get database instance
export function getDatabase() {
  return db
}

// Sample test data for development
export async function insertSampleData() {
  return new Promise((resolve, reject) => {
    const sampleData = {
      product_name: 'Meditation Teacher Training Course',
      description: '8-week intensive online program teaching meditation techniques and how to become a certified meditation instructor',
      target_audience: 'Yoga practitioners and wellness enthusiasts aged 25-45 looking to deepen their practice or start a teaching career',
      launch_date: '2026-03-15',
      budget_range: '₹1,00,000 - ₹2,00,000',
      industry: 'Education & Courses',
      key_benefits: 'Internationally recognized certification, lifetime access to materials, weekly live sessions with experienced teachers, personal mentorship, community of like-minded practitioners',
      marketing_plan: JSON.stringify({
        overview: {
          campaign_name: 'Sample Campaign',
          duration: '4 weeks',
          total_budget: '₹1,50,000',
          primary_channels: ['Email', 'WhatsApp', 'Social Media'],
          success_definition: 'Sample success metrics'
        }
      }),
      email_assets: JSON.stringify({ emails: [] }),
      whatsapp_assets: JSON.stringify({ whatsapp_sequence: [] }),
      social_assets: JSON.stringify({ social_posts: [] })
    }

    db.run(`
      INSERT INTO campaigns (
        product_name, description, target_audience, launch_date,
        budget_range, industry, key_benefits, marketing_plan,
        email_assets, whatsapp_assets, social_assets
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      sampleData.product_name,
      sampleData.description,
      sampleData.target_audience,
      sampleData.launch_date,
      sampleData.budget_range,
      sampleData.industry,
      sampleData.key_benefits,
      sampleData.marketing_plan,
      sampleData.email_assets,
      sampleData.whatsapp_assets,
      sampleData.social_assets
    ], function(err) {
      if (err) {
        console.error('Error inserting sample data:', err.message)
        reject(err)
      } else {
        console.log('Sample data inserted with ID:', this.lastID)
        resolve(this.lastID)
      }
    })
  })
}

export default db
