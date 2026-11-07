import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Home from './pages/Home'
import DepositForm from './pages/DepositForm'
import RiskForm from './pages/RiskForm'
import ChatPage from './pages/ChatPage'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <MotionConfig reducedMotion="user">
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <a href="#main" className="btn btn-primary skip-link h-9 px-3">Skip to content</a>
            <Navbar />
            <main id="main" tabIndex={-1} className="flex-grow pt-16 focus:outline-none">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/deposit" element={<ProtectedRoute><DepositForm /></ProtectedRoute>} />
                <Route path="/risk" element={<ProtectedRoute><RiskForm /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              </Routes>
          </main>
          <footer className="mt-auto w-full border-t border-line py-6 text-xs leading-5 text-fg-3">
            <p className="mx-auto max-w-6xl px-4 sm:px-6">
              <span className="text-fg-2">Disclaimer:</span> The predictions and insights provided by this AI Financial Advisor are for informational and educational purposes only. 
              They do not constitute professional financial advice. Always consult with a certified financial planner before making real investment decisions.
            </p>
          </footer>
        </div>
      </Router>
      </AuthProvider>
      </MotionConfig>
    </>
  )
}

export default App
