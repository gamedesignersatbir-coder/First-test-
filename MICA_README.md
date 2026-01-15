# MiCA - AI-Powered Marketing Campaign Generator

**MiCA** (Marketing Campaign AI) is a full-stack web application that generates complete marketing campaigns using Claude AI. Small business owners can input their product details and receive ready-to-use marketing assets including emails, WhatsApp messages, and social media posts.

---

## 🎯 Project Overview

MiCA helps solo entrepreneurs and small business owners who can't afford marketing agencies to create professional marketing campaigns in minutes. The AI generates:

- 📋 **4-Week Marketing Plan** with daily tactics
- 📧 **5 Email Templates** (from teaser to final CTA)
- 💬 **8 WhatsApp Messages** (awareness to conversion)
- 📱 **10 Social Media Posts** (Instagram/Facebook)

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite3** - Database (file-based, no external service needed)
- **Claude API** (Anthropic Sonnet 4.5) - AI generation
- **dotenv** - Environment variables

---

## 📁 Project Structure

```
mica-test/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Landing, Form, Dashboard
│   │   │   ├── LandingPage.jsx
│   │   │   ├── CampaignForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                # Node.js backend
│   ├── routes/            # API endpoints
│   │   └── campaigns.js
│   ├── services/          # AI integration logic
│   │   └── ai.js
│   ├── database/          # SQLite setup
│   │   └── init.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── shared/                # Shared types/utils (future use)
├── .gitignore
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ and npm
- **Anthropic API Key** (get it from https://console.anthropic.com/)

### Step 1: Clone/Navigate to Project

```bash
cd /home/user/First-test-
```

### Step 2: Set Up Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your API key
# ANTHROPIC_API_KEY=your_api_key_here
# PORT=3001
```

**Important:** Get your Anthropic API key from https://console.anthropic.com/ and add it to the `.env` file.

### Step 3: Set Up Frontend

```bash
cd ../client

# Install dependencies
npm install
```

---

## ▶️ Running the Application

You'll need **two terminal windows** - one for backend, one for frontend.

### Terminal 1: Start Backend Server

```bash
cd server
npm run dev
```

Server will start at `http://localhost:3001`

### Terminal 2: Start Frontend Dev Server

```bash
cd client
npm run dev
```

Frontend will start at `http://localhost:5173`

Open your browser and go to: **http://localhost:5173**

---

## 🧪 Testing with Sample Data

Use this sample data to test the application:

### Product Details:
- **Product Name:** Meditation Teacher Training Course
- **Description:** 8-week intensive online program teaching meditation techniques and how to become a certified meditation instructor
- **Target Audience:** Yoga practitioners and wellness enthusiasts aged 25-45 looking to deepen their practice or start a teaching career
- **Launch Date:** March 15, 2026 (or any future date)
- **Budget Range:** ₹1,00,000 - ₹2,00,000
- **Industry:** Education & Courses
- **Key Benefits:** Internationally recognized certification, lifetime access to materials, weekly live sessions with experienced teachers, personal mentorship, community of like-minded practitioners

### What to Expect:
1. Fill the form (takes 2-3 minutes)
2. Click "Generate My Campaign"
3. Wait 30-90 seconds for AI generation
4. View complete campaign with all assets
5. Copy any asset with one click

---

## 📡 API Endpoints

### Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/campaigns` | Get all campaigns |
| GET | `/campaign/:id` | Get single campaign |
| POST | `/generate-campaign` | Create new campaign (triggers AI) |
| DELETE | `/campaign/:id` | Delete campaign |

### Example Request: Generate Campaign

```bash
curl -X POST http://localhost:3001/api/generate-campaign \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Meditation Teacher Training",
    "description": "8-week intensive program...",
    "target_audience": "Yoga practitioners aged 25-45",
    "launch_date": "2026-03-15",
    "budget_range": "₹1,00,000 - ₹2,00,000",
    "industry": "Education & Courses",
    "key_benefits": "Certification, lifetime access..."
  }'
```

### Example Response:

```json
{
  "campaign_id": 1,
  "status": "generating",
  "message": "Campaign created. AI generation in progress..."
}
```

---

## 🎨 Features

### Landing Page
- Clean, modern hero section
- Visual 3-step process explanation
- Large "Create Campaign" CTA
- Fully responsive design

### Campaign Form
- All required fields with validation
- Character counters on textareas
- Date validation (no past dates)
- Real-time client-side validation
- Loading spinner during submission

### Dashboard
- **5 Tabs:** Plan, Emails, WhatsApp, Social, Summary
- Real-time polling while AI generates content
- Copy-to-clipboard for all assets
- Visual feedback ("✓ Copied!")
- Mobile-responsive tabbed interface

### AI Generation
- Sequential calls to Claude API
- 4 specialized prompts for different assets
- JSON parsing with error handling
- Asynchronous generation (doesn't block response)
- Automatic database updates

---

## 🔒 Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Required
ANTHROPIC_API_KEY=your_api_key_here

# Optional
PORT=3001
```

**Never commit your `.env` file to version control!**

---

## 🗄 Database Schema

**Table:** `campaigns`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| user_id | TEXT | User identifier (default: 'demo_user') |
| product_name | TEXT | Product/course/event name |
| description | TEXT | Brief description |
| target_audience | TEXT | Target audience details |
| launch_date | TEXT | Launch date (ISO format) |
| budget_range | TEXT | Budget range |
| industry | TEXT | Industry/category |
| key_benefits | TEXT | Key benefits |
| marketing_plan | TEXT | JSON string of marketing plan |
| email_assets | TEXT | JSON string of email campaign |
| whatsapp_assets | TEXT | JSON string of WhatsApp sequence |
| social_assets | TEXT | JSON string of social posts |
| created_at | DATETIME | Creation timestamp |

The database file (`mica.db`) is automatically created in `server/database/` when the server starts.

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:** Make sure the backend server is running on port 3001.

```bash
cd server
npm run dev
```

### Issue: "Failed to generate campaign"
**Possible causes:**
1. Missing or invalid `ANTHROPIC_API_KEY` in `.env`
2. API rate limits exceeded
3. Network connectivity issues

**Solution:** Check your API key and ensure you have API credits.

### Issue: "Campaign shows 'Generating...' forever"
**Solution:** Check the backend terminal for errors. The API calls might have failed.

### Issue: "Module not found" errors
**Solution:** Reinstall dependencies:

```bash
# In client/
npm install

# In server/
npm install
```

### Issue: Database errors
**Solution:** Delete the database file and restart the server:

```bash
rm server/database/mica.db
cd server
npm run dev
```

---

## 📋 Known Limitations

1. **No User Authentication:** Currently uses a demo user ID for all campaigns
2. **No Asset Download:** Copy-to-clipboard only (no PDF/ZIP download yet)
3. **No Campaign Editing:** Can't edit campaigns after creation
4. **Single User:** Not multi-tenant (all campaigns visible to everyone)
5. **API Rate Limits:** Claude API has rate limits that may affect generation
6. **No Email Sending:** Generated emails are templates only (not sent)

---

## 🚧 Future Enhancements

### Phase 1 (MVP+)
- [ ] User authentication (login/signup)
- [ ] My Campaigns page (list all user's campaigns)
- [ ] Download campaign as PDF
- [ ] Download all assets as ZIP
- [ ] Edit campaign after creation

### Phase 2 (Polish)
- [ ] Campaign templates (pre-filled forms)
- [ ] Campaign sharing (shareable links)
- [ ] Campaign analytics (views, copies)
- [ ] Dark mode
- [ ] Multi-language support

### Phase 3 (Advanced)
- [ ] AI regeneration (regenerate specific assets)
- [ ] Custom branding (logo, colors)
- [ ] A/B testing suggestions
- [ ] Schedule publishing (calendar integration)
- [ ] Email sending integration (SendGrid, Mailchimp)
- [ ] Social media auto-posting

---

## 🔧 Development Scripts

### Client (React)

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server (Node.js)

```bash
npm start        # Start server (production)
npm run dev      # Start with hot reload (--watch flag)
```

---

## 📊 Success Criteria

A user should be able to:

1. ✅ Fill form in 2-3 minutes
2. ✅ Submit and see loading states
3. ✅ Wait 30-90 seconds for AI generation
4. ✅ View complete 4-week marketing plan
5. ✅ Browse 5 emails, 8 WhatsApp messages, 10 social posts
6. ✅ Copy any asset with one click
7. ✅ Return later and see saved campaign
8. ✅ Create multiple campaigns

---

## 🤝 Contributing

This is a prototype/test project. If you want to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational/testing purposes. Feel free to use it as a template for your own projects.

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the backend terminal for error logs
3. Ensure all dependencies are installed
4. Verify your `ANTHROPIC_API_KEY` is valid

---

## 🎉 Credits

- **AI Model:** Claude Sonnet 4.5 by Anthropic
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Database:** SQLite3

---

**Built with ❤️ for small business owners who dream big!**
