import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, loginWithGoogle } = useAuth();

  return (
    <div className="pt-20 md:pt-24 flex flex-col items-center min-h-screen text-center px-4 md:px-6">
      
      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mt-12 md:mt-16 w-full"
      >
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs md:text-sm font-semibold tracking-wide">
          ✨ The Future of Wealth Management
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          Your Smart <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
            AI Financial Advisor
          </span>
        </h1>
        <p className="text-base md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
          Unlock personalized investment strategies, dual-perspective risk assessments, 
          and butterfly-effect deposit predictions powered by next-generation Generative AI.
        </p>

        {!user ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loginWithGoogle}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </motion.button>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4 w-full max-w-lg mx-auto">
            <Link to="/deposit" className="w-full">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 text-sm md:text-base"
              >
                Deposit Prediction
              </motion.button>
            </Link>
            <Link to="/risk" className="w-full">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 text-sm md:text-base"
              >
                Risk Assessment
              </motion.button>
            </Link>
            <Link to="/chat" className="w-full">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 rounded-2xl bg-gray-800 border border-white/10 hover:bg-gray-700 text-white font-bold shadow-lg text-sm md:text-base"
              >
                AI Chat
              </motion.button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* FEATURES GRID */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mt-24 mb-16 px-4"
      >
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl text-left backdrop-blur-sm">
          <div className="text-3xl mb-4">🦋</div>
          <h3 className="text-xl font-bold mb-2 text-indigo-300">Butterfly Effect</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Discover how 1 or 2 hyper-specific changes to your lifestyle can drastically alter your financial universe for the better.</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl text-left backdrop-blur-sm">
          <div className="text-3xl mb-4">🎭</div>
          <h3 className="text-xl font-bold mb-2 text-cyan-300">Dual Perspectives</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Get roasted by a WallStreetBets Degen or advised by a wise Boomer investor based on your mathematical risk profile.</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl text-left backdrop-blur-sm">
          <div className="text-3xl mb-4">💬</div>
          <h3 className="text-xl font-bold mb-2 text-emerald-300">Interactive AI Chat</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Ask any financial question to our AI. Switch between professional, savage, or Gen-Z personas for tailored advice.</p>
        </div>
      </motion.div>

    </div>
  );
}

export default Home;
