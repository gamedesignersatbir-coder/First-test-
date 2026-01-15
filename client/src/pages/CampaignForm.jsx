import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function CampaignForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    target_audience: '',
    launch_date: '',
    budget_range: '',
    industry: '',
    key_benefits: ''
  })

  const [charCounts, setCharCounts] = useState({
    description: 0,
    key_benefits: 0
  })

  const budgetOptions = [
    '₹50,000 - ₹1,00,000',
    '₹1,00,000 - ₹2,00,000',
    '₹2,00,000+'
  ]

  const industryOptions = [
    'Education & Courses',
    'Health & Wellness',
    'E-commerce & Retail',
    'Professional Services',
    'Events & Workshops',
    'Other'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Update character counts
    if (name === 'description') {
      setCharCounts(prev => ({ ...prev, description: value.length }))
    } else if (name === 'key_benefits') {
      setCharCounts(prev => ({ ...prev, key_benefits: value.length }))
    }
  }

  const validateForm = () => {
    // Check all required fields
    if (!formData.product_name.trim()) {
      setError('Product name is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Product description is required')
      return false
    }
    if (formData.description.length > 500) {
      setError('Description must be 500 characters or less')
      return false
    }
    if (!formData.target_audience.trim()) {
      setError('Target audience is required')
      return false
    }
    if (!formData.launch_date) {
      setError('Launch date is required')
      return false
    }
    // Validate future date
    const selectedDate = new Date(formData.launch_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      setError('Launch date must be in the future')
      return false
    }
    if (!formData.budget_range) {
      setError('Budget range is required')
      return false
    }
    if (!formData.industry) {
      setError('Industry is required')
      return false
    }
    if (!formData.key_benefits.trim()) {
      setError('Key benefits are required')
      return false
    }
    if (formData.key_benefits.length > 300) {
      setError('Key benefits must be 300 characters or less')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/generate-campaign', formData)
      const { campaign_id } = response.data

      // Navigate to dashboard
      navigate(`/campaign/${campaign_id}`)
    } catch (err) {
      console.error('Error creating campaign:', err)
      setError(err.response?.data?.error || 'Failed to create campaign. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-secondary mb-4 inline-flex items-center"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Campaign</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to generate your AI-powered marketing campaign
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-2">
              Product/Course/Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Meditation Teacher Training Course"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Brief Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              maxLength="500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Describe your product in 3-5 sentences (max 500 characters)"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {charCounts.description}/500 characters
            </p>
          </div>

          {/* Target Audience */}
          <div>
            <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="target_audience"
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., working professionals aged 25-40"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Be specific about age, profession, or interests
            </p>
          </div>

          {/* Launch Date */}
          <div>
            <label htmlFor="launch_date" className="block text-sm font-medium text-gray-700 mb-2">
              Launch Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="launch_date"
              name="launch_date"
              value={formData.launch_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Budget Range */}
          <div>
            <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range <span className="text-red-500">*</span>
            </label>
            <select
              id="budget_range"
              name="budget_range"
              value={formData.budget_range}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select budget range</option>
              {budgetOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Industry/Category <span className="text-red-500">*</span>
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select industry</option>
              {industryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Key Benefits */}
          <div>
            <label htmlFor="key_benefits" className="block text-sm font-medium text-gray-700 mb-2">
              Key Benefits <span className="text-red-500">*</span>
            </label>
            <textarea
              id="key_benefits"
              name="key_benefits"
              value={formData.key_benefits}
              onChange={handleChange}
              rows="4"
              maxLength="300"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="List the main benefits (max 300 characters)"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {charCounts.key_benefits}/300 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Campaign...
                </span>
              ) : (
                'Generate My Campaign'
              )}
            </button>
            {loading && (
              <p className="text-center text-sm text-gray-600 mt-3">
                This will take 30-90 seconds. Please don't close this window.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CampaignForm
