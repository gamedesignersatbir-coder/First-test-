import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CampaignForm from './pages/CampaignForm'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CampaignForm />} />
        <Route path="/campaign/:id" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
