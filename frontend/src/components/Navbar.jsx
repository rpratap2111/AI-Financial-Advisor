import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black/30 backdrop-blur-md fixed w-full z-50 border-b border-gray-800">
      <Link to="/" className="flex items-center gap-3 text-xl font-bold text-indigo-400 tracking-wider">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">AI Advisor</span>
      </Link>
      
      <div className="flex items-center gap-8">
        <div className="flex gap-6">
          <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
          <Link to="/deposit" className="hover:text-indigo-400 transition-colors">Deposit</Link>
          <Link to="/risk" className="hover:text-indigo-400 transition-colors">Risk</Link>
          <Link to="/chat" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold hover:opacity-80 transition-opacity">AI Chat</Link>
        </div>
        
        <div className="h-6 w-px bg-gray-700 hidden md:block"></div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <img src={user.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="Profile" className="w-8 h-8 rounded-full border border-gray-600" />
            <button 
              onClick={logout}
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={loginWithGoogle}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google lg" className="w-4 h-4" />
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
