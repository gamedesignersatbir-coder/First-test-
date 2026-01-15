import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Marketing Campaigns in Minutes
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            For solo business owners who can't afford agencies
          </p>
        </div>

        {/* 3-Step Process */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Enter Product Details</h3>
            <p className="text-gray-600">
              Tell us about your product, target audience, and goals
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Creates Your Campaign</h3>
            <p className="text-gray-600">
              Our AI generates a complete 4-week marketing strategy
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Ready-to-Use Assets</h3>
            <p className="text-gray-600">
              Receive emails, WhatsApp messages, and social media posts
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/create')}
            className="bg-primary hover:bg-secondary text-white font-bold py-4 px-12 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
