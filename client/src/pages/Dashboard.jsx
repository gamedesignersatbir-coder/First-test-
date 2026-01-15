import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('plan')
  const [copiedItem, setCopiedItem] = useState(null)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    fetchCampaign()
    // Poll for updates if campaign is still generating
    const interval = setInterval(() => {
      if (isGenerating) {
        fetchCampaign()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [id, isGenerating])

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`/api/campaign/${id}`)
      setCampaign(response.data)

      // Check if all assets are generated
      if (response.data.marketing_plan && response.data.email_assets &&
          response.data.whatsapp_assets && response.data.social_assets) {
        setIsGenerating(false)
      }

      setLoading(false)
    } catch (err) {
      console.error('Error fetching campaign:', err)
      setError('Failed to load campaign')
      setLoading(false)
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text, itemId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(itemId)
      setTimeout(() => setCopiedItem(null), 2000)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaign...</p>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Campaign not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary hover:text-secondary"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-secondary mb-4 inline-flex items-center"
          >
            ← Back to Home
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{campaign.product_name}</h1>
              <p className="text-gray-600 mt-1">
                Created {new Date(campaign.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Create New Campaign
            </button>
          </div>
        </div>

        {/* Generation in Progress Banner */}
        {isGenerating && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-blue-800">AI is generating your marketing assets... This will take 30-90 seconds.</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              {[
                { id: 'plan', label: 'Marketing Plan', icon: '📋' },
                { id: 'emails', label: 'Emails', icon: '📧' },
                { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                { id: 'social', label: 'Social Media', icon: '📱' },
                { id: 'summary', label: 'Summary', icon: '📊' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'plan' && (
              <MarketingPlanTab plan={campaign.marketing_plan} isGenerating={isGenerating} />
            )}
            {activeTab === 'emails' && (
              <EmailsTab emails={campaign.email_assets} copyToClipboard={copyToClipboard} copiedItem={copiedItem} isGenerating={isGenerating} />
            )}
            {activeTab === 'whatsapp' && (
              <WhatsAppTab messages={campaign.whatsapp_assets} copyToClipboard={copyToClipboard} copiedItem={copiedItem} isGenerating={isGenerating} />
            )}
            {activeTab === 'social' && (
              <SocialTab posts={campaign.social_assets} copyToClipboard={copyToClipboard} copiedItem={copiedItem} isGenerating={isGenerating} />
            )}
            {activeTab === 'summary' && (
              <SummaryTab campaign={campaign} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Marketing Plan Tab Component
function MarketingPlanTab({ plan, isGenerating }) {
  if (isGenerating || !plan) {
    return <div className="text-center py-8 text-gray-500">Generating marketing plan...</div>
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-primary bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.overview?.campaign_name}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-semibold">{plan.overview?.duration}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="font-semibold">{plan.overview?.total_budget}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Primary Channels</p>
            <p className="font-semibold">{plan.overview?.primary_channels?.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Weekly Plans */}
      {plan.weeks?.map((week, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
              {week.week_number}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{week.week_name}</h3>
              <p className="text-gray-600">{week.objective}</p>
            </div>
          </div>

          {/* Tactics */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Daily Tactics:</h4>
            <ul className="space-y-2">
              {week.tactics?.map((tactic, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="font-semibold text-primary mr-2">Day {tactic.day}:</span>
                  <span className="text-gray-700">{tactic.action} ({tactic.channel})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Messages */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Key Messages:</h4>
            <ul className="list-disc list-inside space-y-1">
              {week.key_messages?.map((message, idx) => (
                <li key={idx} className="text-gray-700">{message}</li>
              ))}
            </ul>
          </div>

          {/* Metrics */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Success Metrics:</h4>
            <div className="flex flex-wrap gap-2">
              {week.metrics?.map((metric, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Emails Tab Component
function EmailsTab({ emails, copyToClipboard, copiedItem, isGenerating }) {
  if (isGenerating || !emails) {
    return <div className="text-center py-8 text-gray-500">Generating email campaign...</div>
  }

  return (
    <div className="space-y-6">
      {emails.emails?.map((email, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📧</span>
                <h3 className="text-xl font-bold text-gray-900">Email {email.email_number}: {email.name}</h3>
              </div>
              <p className="text-lg font-semibold text-primary">{email.subject_line}</p>
              <p className="text-sm text-gray-500 italic">{email.preview_text}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4 whitespace-pre-wrap text-gray-700">
            {email.body}
          </div>

          <button
            onClick={() => copyToClipboard(email.body, `email-${index}`)}
            className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {copiedItem === `email-${index}` ? '✓ Copied!' : 'Copy Email'}
          </button>
        </div>
      ))}
    </div>
  )
}

// WhatsApp Tab Component
function WhatsAppTab({ messages, copyToClipboard, copiedItem, isGenerating }) {
  if (isGenerating || !messages) {
    return <div className="text-center py-8 text-gray-500">Generating WhatsApp sequence...</div>
  }

  return (
    <div className="space-y-4">
      {messages.whatsapp_sequence?.map((message, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">💬</span>
                <h3 className="text-lg font-bold text-gray-900">Message {message.message_number}</h3>
              </div>
              <p className="text-sm text-gray-500">{message.timing_suggestion}</p>
              <p className="text-sm text-gray-600 italic">{message.purpose}</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
            <p className="text-gray-800">{message.message_text}</p>
          </div>

          <button
            onClick={() => copyToClipboard(message.message_text, `whatsapp-${index}`)}
            className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {copiedItem === `whatsapp-${index}` ? '✓ Copied!' : 'Copy Message'}
          </button>
        </div>
      ))}
    </div>
  )
}

// Social Media Tab Component
function SocialTab({ posts, copyToClipboard, copiedItem, isGenerating }) {
  if (isGenerating || !posts) {
    return <div className="text-center py-8 text-gray-500">Generating social media posts...</div>
  }

  return (
    <div className="space-y-6">
      {posts.social_posts?.map((post, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📱</span>
                <h3 className="text-lg font-bold text-gray-900">Post {post.post_number}: {post.post_type}</h3>
              </div>
              <p className="text-sm text-gray-500">{post.suggested_day}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.caption}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.hashtags?.map((tag, idx) => (
                <span key={idx} className="text-primary font-medium">{tag}</span>
              ))}
            </div>
          </div>

          {post.engagement_tip && (
            <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800">
              <strong>Tip:</strong> {post.engagement_tip}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(post.caption, `social-caption-${index}`)}
              className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {copiedItem === `social-caption-${index}` ? '✓ Copied!' : 'Copy Caption'}
            </button>
            <button
              onClick={() => copyToClipboard(post.hashtags?.join(' '), `social-hashtags-${index}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {copiedItem === `social-hashtags-${index}` ? '✓ Copied!' : 'Copy Hashtags'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Summary Tab Component
function SummaryTab({ campaign }) {
  return (
    <div className="space-y-6">
      {/* Campaign Details */}
      <div className="bg-primary bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Overview</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Product</p>
            <p className="font-semibold">{campaign.product_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Industry</p>
            <p className="font-semibold">{campaign.industry}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Target Audience</p>
            <p className="font-semibold">{campaign.target_audience}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Launch Date</p>
            <p className="font-semibold">{new Date(campaign.launch_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Budget Range</p>
            <p className="font-semibold">{campaign.budget_range}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="font-semibold">{new Date(campaign.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">Description</p>
          <p className="text-gray-800">{campaign.description}</p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">Key Benefits</p>
          <p className="text-gray-800">{campaign.key_benefits}</p>
        </div>
      </div>

      {/* Assets Generated */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Total Assets Generated</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <span className="text-3xl mr-4">📋</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-600">Marketing Plan (4 weeks)</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <span className="text-3xl mr-4">📧</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{campaign.email_assets?.emails?.length || 5}</p>
              <p className="text-sm text-gray-600">Email Templates</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
            <span className="text-3xl mr-4">💬</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{campaign.whatsapp_assets?.whatsapp_sequence?.length || 8}</p>
              <p className="text-sm text-gray-600">WhatsApp Messages</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 rounded-lg">
            <span className="text-3xl mr-4">📱</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{campaign.social_assets?.social_posts?.length || 10}</p>
              <p className="text-sm text-gray-600">Social Media Posts</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {(campaign.email_assets?.emails?.length || 5) + (campaign.whatsapp_assets?.whatsapp_sequence?.length || 8) + (campaign.social_assets?.social_posts?.length || 10) + 1}
          </div>
          <p className="text-gray-600">Total Marketing Assets</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
