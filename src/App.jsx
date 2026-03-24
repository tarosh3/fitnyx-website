import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import PreRegModal from './components/PreRegModal'
import Footer from './components/Footer'
import Home from './pages/Home'
import PolicyPage from './pages/PolicyPage'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const location = useLocation()

  const openPreReg = () => setModalOpen(true)
  const closePreReg = () => setModalOpen(false)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <Navbar onPreReg={openPreReg} />
      <PreRegModal isOpen={modalOpen} onClose={closePreReg} />
      
      <Routes>
        <Route path="/" element={<Home openPreReg={openPreReg} />} />
        
        <Route path="/privacy-policy" element={
          <PolicyPage title="Privacy Policy" lastUpdated="February 16, 2026">
            <h2>1. Introduction</h2>
            <p>Welcome to FitNyx ("we", "our", or "us"). This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website and services. By using FitNyx, you agree to the practices described in this Privacy Policy.</p>
            
            <h2>2. Information We Collect</h2>
            <h3>A. Personal Information</h3>
            <p>When you create an account, we may collect: Name, Email address, Age, Gender, Height, Weight, Fitness goals, and Profile preferences.</p>
            
            <h3>B. Workout & Health Data</h3>
            <p>When you use FitNyx, we may collect: Workout plans, Exercise logs (sets, reps, weight, duration), Session history, Progress data, and Nutrition-related inputs.</p>
            
            <h3>C. AI Interaction Data</h3>
            <p>When you use the AI Coach: Messages you send, AI responses, and Context generated from your fitness profile and logs.</p>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to provide and improve FitNyx services, personalize workout recommendations, generate AI-based fitness insights, and comply with legal obligations. We do not sell your personal data to third parties.</p>
            
            <h2>4. AI Processing</h2>
            <p>FitNyx may use third-party AI providers to generate personalized fitness responses. Relevant fitness and profile data may be processed securely. AI responses are informational only and do not constitute medical advice.</p>
            
            <h2>5. Data Rights & Security</h2>
            <p>We implement reasonable safeguards to protect your information. Depending on your location, you may have rights to access, correct, or delete your data. Contact us at support@fitnyx.in to exercise these rights.</p>
          </PolicyPage>
        } />

        <Route path="/terms-of-service" element={
          <PolicyPage title="Terms of Service" lastUpdated="February 16, 2026">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using FitNyx, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.</p>
            
            <h2>2. Description of Service</h2>
            <p>FitNyx provides workout planning tools, exercise tracking, fitness analytics, and AI-based fitness insights. FitNyx is a fitness support platform and does not provide medical services.</p>
            
            <h2>3. User Responsibilities</h2>
            <p>You agree to provide accurate information and maintain the confidentiality of your account. You use FitNyx at your own risk. Always consult a healthcare provider before beginning any exercise program.</p>
            
            <h2>4. AI Coach Usage</h2>
            <p>The AI Coach generates responses based on user data and may occasionally produce inaccurate information. It should not be relied upon for medical decisions.</p>
            
            <h2>5. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, FitNyx shall not be liable for injuries, health issues, or data loss associated with the use of the service.</p>
          </PolicyPage>
        } />

        <Route path="/delete-account" element={
          <PolicyPage title="Delete Account & Data">
            <p>FitNyx respects your privacy and your right to control your data. If you wish to delete your FitNyx account and all associated data, you can do so using the methods described below.</p>
            
            <div className="option-box">
              <h3>Option 1: Remove FitNyx from Facebook</h3>
              <p>If you signed up via Facebook, you can revoke access directly through Facebook Settings & Privacy → Apps and Websites. Find FitNyx and click Remove.</p>
            </div>

            <div className="option-box">
              <h3>Option 2: Request Manual Deletion</h3>
              <p>To permanently delete your FitNyx account and all associated fitness data from our database, send us an email at <strong>support@fitnyx.in</strong>.</p>
              <p>Please include the email address associated with your FitNyx account. We will process your deletion within 30 days and confirm via email once complete.</p>
            </div>

            <h2>What data is deleted?</h2>
            <ul>
              <li>Your account profile and preferences</li>
              <li>Workout plans and exercise logs</li>
              <li>Session history and progress data</li>
              <li>AI Coach conversation history</li>
            </ul>
          </PolicyPage>
        } />
      </Routes>

      <Footer />
    </>
  )
}
