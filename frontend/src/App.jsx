import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
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
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/deposit" element={<ProtectedRoute><DepositForm /></ProtectedRoute>} />
                <Route path="/risk" element={<ProtectedRoute><RiskForm /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              </Routes>
          </main>
          <footer className="w-full text-center py-4 text-xs text-gray-500 mt-auto border-t border-gray-800 bg-black/30 backdrop-blur-sm">
            <p className="max-w-4xl mx-auto px-4">
              <strong>Disclaimer:</strong> The predictions and insights provided by this AI Financial Advisor are for informational and educational purposes only. 
              They do not constitute professional financial advice. Always consult with a certified financial planner before making real investment decisions.
            </p>
          </footer>
        </div>
      </Router>
      </AuthProvider>
    </>
  )
}

export default App
