import Anthropic from '@anthropic-ai/sdk'
import { getDatabase } from '../database/init.js'

const db = getDatabase()

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
})

// Helper function to call Claude API
async function callClaude(prompt) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const responseText = message.content[0].text

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '')
    }

    return JSON.parse(jsonText)
  } catch (error) {
    console.error('Error calling Claude API:', error)
    throw error
  }
}

// Generate marketing plan
async function generateMarketingPlan(formData) {
  const prompt = `You are an expert marketing strategist specializing in small business campaigns. Create a comprehensive 4-week marketing campaign plan.

Product Details:
- Name: ${formData.product_name}
- Description: ${formData.description}
- Target Audience: ${formData.target_audience}
- Launch Date: ${formData.launch_date}
- Budget: ${formData.budget_range}
- Industry: ${formData.industry}
- Key Benefits: ${formData.key_benefits}

Generate a detailed 4-week campaign plan with:

Week 1: Awareness & Teasing
- Main objective
- 5 specific daily tactics
- Channels to use (email, WhatsApp, social media)
- Key messaging themes
- Success metrics

Week 2: Education & Value Building
- Main objective
- 5 specific daily tactics
- Channels to use
- Key messaging themes
- Success metrics

Week 3: Social Proof & FOMO Building
- Main objective
- 5 specific daily tactics
- Channels to use
- Key messaging themes
- Success metrics

Week 4: Launch & Conversion
- Main objective
- 5 specific daily tactics
- Channels to use
- Key messaging themes
- Success metrics

Return ONLY valid JSON in this exact structure:
{
  "overview": {
    "campaign_name": "...",
    "duration": "4 weeks",
    "total_budget": "...",
    "primary_channels": [...],
    "success_definition": "..."
  },
  "weeks": [
    {
      "week_number": 1,
      "week_name": "Awareness & Teasing",
      "objective": "...",
      "tactics": [
        {"day": 1, "action": "...", "channel": "..."},
        {"day": 2, "action": "...", "channel": "..."},
        {"day": 3, "action": "...", "channel": "..."},
        {"day": 4, "action": "...", "channel": "..."},
        {"day": 5, "action": "...", "channel": "..."}
      ],
      "key_messages": [...],
      "channels": [...],
      "metrics": [...]
    }
  ]
}

Be specific, actionable, and realistic for a ${formData.budget_range} budget.`

  return await callClaude(prompt)
}

// Generate email campaign
async function generateEmailCampaign(formData) {
  const prompt = `Generate 5 professional marketing emails for the following product campaign:

Product: ${formData.product_name}
Description: ${formData.description}
Target Audience: ${formData.target_audience}
Launch Date: ${formData.launch_date}

Create these 5 emails in sequence:

Email 1: Launch Announcement / Teaser
- Purpose: Create awareness and excitement
- Tone: Enthusiastic, intriguing
- Length: 200-250 words
- Include: Hook, brief product intro, CTA to learn more

Email 2: Value Proposition Deep-Dive
- Purpose: Educate on benefits and features
- Tone: Informative, helpful
- Length: 300-350 words
- Include: Problem statement, solution details, key benefits, CTA

Email 3: Social Proof & Testimonials
- Purpose: Build trust and credibility
- Tone: Authentic, relatable
- Length: 250-300 words
- Include: Success stories, testimonials (create realistic ones), authority signals, CTA

Email 4: FOMO & Urgency
- Purpose: Drive decision-making
- Tone: Urgent but not pushy
- Length: 200-250 words
- Include: Limited availability, time constraint, special offer, CTA

Email 5: Final Call-to-Action
- Purpose: Close the sale
- Tone: Direct, clear, supportive
- Length: 150-200 words
- Include: Last chance messaging, recap of value, clear next steps, CTA

Return ONLY valid JSON:
{
  "emails": [
    {
      "email_number": 1,
      "name": "Launch Announcement",
      "subject_line": "...",
      "preview_text": "...",
      "body": "..."
    }
  ]
}

Make subject lines attention-grabbing (under 60 chars). Use personalization tokens like [First Name] where appropriate.`

  return await callClaude(prompt)
}

// Generate WhatsApp sequence
async function generateWhatsAppSequence(formData) {
  const prompt = `Generate an 8-message WhatsApp nurture sequence for:

Product: ${formData.product_name}
Description: ${formData.description}
Target Audience: ${formData.target_audience}

Requirements:
- Each message: 150-200 characters max (WhatsApp best practice)
- Conversational, friendly tone (not formal like email)
- Emojis where natural
- Clear progression from awareness to conversion
- Actionable CTAs in each message

Message Breakdown:
Messages 1-2: Introduction & Awareness
- Introduce the product casually
- Focus on the problem it solves

Messages 3-4: Value & Education
- Share key benefits
- Provide quick tips or insights

Messages 5-6: Social Proof & Trust
- Share success stories or testimonials
- Build credibility

Messages 7-8: FOMO & Close
- Create urgency
- Clear CTA to enroll/purchase

Return ONLY valid JSON:
{
  "whatsapp_sequence": [
    {
      "message_number": 1,
      "timing_suggestion": "Day 1, 10:00 AM",
      "message_text": "...",
      "purpose": "..."
    }
  ]
}

Keep messages short, conversational, and mobile-friendly.`

  return await callClaude(prompt)
}

// Generate social media posts
async function generateSocialPosts(formData) {
  const prompt = `Generate 10 Instagram/Facebook post captions for:

Product: ${formData.product_name}
Description: ${formData.description}
Target Audience: ${formData.target_audience}
Launch Date: ${formData.launch_date}

Create diverse content types:
Posts 1-3: Awareness/Teaser Content
- Hook audience attention
- Tease the product without full reveal
- Use curiosity gaps

Posts 4-6: Educational/Value Content
- Share tips, insights, or quick wins
- Position product as solution
- Provide genuine value

Posts 7-8: Social Proof/Testimonial Content
- Share success stories (create realistic ones)
- User-generated content style
- Build trust and FOMO

Posts 9-10: Launch/CTA Content
- Direct promotion
- Clear call-to-action
- Urgency and excitement

Requirements:
- 120-150 words per caption
- Engaging hook in first line
- 2-4 relevant emojis per post (natural, not excessive)
- 5-7 hashtags (mix of popular and niche)
- Clear CTA at end
- Suggest posting day relative to launch

Return ONLY valid JSON:
{
  "social_posts": [
    {
      "post_number": 1,
      "post_type": "Teaser",
      "caption": "...",
      "hashtags": ["#...", "..."],
      "suggested_day": "14 days before launch",
      "engagement_tip": "..."
    }
  ]
}

Write in ${formData.target_audience}'s voice. Be authentic, not salesy.`

  return await callClaude(prompt)
}

// Main function to generate complete campaign
export async function generateCampaignWithAI(campaignId, formData) {
  try {
    console.log(`Starting AI generation for campaign ${campaignId}...`)

    // Generate all assets
    console.log('Generating marketing plan...')
    const marketingPlan = await generateMarketingPlan(formData)

    console.log('Generating email campaign...')
    const emailAssets = await generateEmailCampaign(formData)

    console.log('Generating WhatsApp sequence...')
    const whatsappAssets = await generateWhatsAppSequence(formData)

    console.log('Generating social media posts...')
    const socialAssets = await generateSocialPosts(formData)

    // Update database with generated content
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE campaigns
        SET marketing_plan = ?,
            email_assets = ?,
            whatsapp_assets = ?,
            social_assets = ?
        WHERE id = ?
      `, [
        JSON.stringify(marketingPlan),
        JSON.stringify(emailAssets),
        JSON.stringify(whatsappAssets),
        JSON.stringify(socialAssets),
        campaignId
      ], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    console.log(`Campaign ${campaignId} generated successfully!`)
    return { success: true, campaignId }

  } catch (error) {
    console.error(`Error generating campaign ${campaignId}:`, error)
    throw error
  }
}
