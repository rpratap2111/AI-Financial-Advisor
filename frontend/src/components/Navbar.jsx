import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img src="/logo.png" alt="Logo" className="relative w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
              AI Financial Advisor
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/deposit" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Deposit</Link>
              <Link to="/risk" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Risk</Link>
              <Link to="/chat" className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 hover:from-blue-300 hover:to-emerald-300 transition-all">
                AI Chat
              </Link>
            </div>

            <div className="h-4 w-px bg-white/10"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.photoURL || "/default-avatar.png"} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full ring-2 ring-white/10" 
                  />
                  <span className="hidden lg:block text-sm font-medium text-white/90 truncate max-w-[120px]">
                    {user.displayName?.split(' ')[0]}
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors py-1 px-3 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link 
              to="/" 
              onClick={toggleMenu}
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Home
            </Link>
            <Link 
              to="/deposit" 
              onClick={toggleMenu}
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Deposit Prediction
            </Link>
            <Link 
              to="/risk" 
              onClick={toggleMenu}
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Risk Assessment
            </Link>
            <Link 
              to="/chat" 
              onClick={toggleMenu}
              className="block px-3 py-2 text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
            >
              AI Chat
            </Link>
            
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.photoURL || "/default-avatar.png"} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full" 
                    />
                    <span className="text-sm font-medium text-white">{user.displayName}</span>
                  </div>
                  <button 
                    onClick={() => { logout(); toggleMenu(); }}
                    className="text-xs font-bold text-gray-400 hover:text-red-400 uppercase tracking-widest"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { loginWithGoogle(); toggleMenu(); }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black font-bold rounded-xl"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
