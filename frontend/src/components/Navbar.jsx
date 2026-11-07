import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import GoogleIcon from "./GoogleIcon";

const links = [
  { to: "/", label: "Home", mobileLabel: "Home" },
  { to: "/deposit", label: "Deposit", mobileLabel: "Deposit prediction" },
  { to: "/risk", label: "Risk", mobileLabel: "Risk assessment" },
  { to: "/chat", label: "AI chat", mobileLabel: "AI chat" },
];

const Avatar = ({ user, size }) =>
  user.photoURL ? (
    <img src={user.photoURL} alt="" className={`${size} rounded-full object-cover`} />
  ) : (
    <span className={`${size} flex items-center justify-center rounded-full bg-raised text-xs text-fg-2`}>
      {user.displayName?.charAt(0) || "?"}
    </span>
  );

function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed z-50 w-full border-b border-line bg-page">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex h-11 items-center gap-2">
          <img src="/logo-mark.png" alt="" className="h-7 w-7 object-contain" />
          <span className="text-base font-medium text-fg">AI Financial Advisor</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-150 ${isActive ? "text-fg" : "text-fg-2 hover:text-fg"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-4 border-l border-line pl-8">
              <div className="flex items-center gap-2">
                <Avatar user={user} size="h-7 w-7" />
                <span className="hidden max-w-[120px] truncate text-sm text-fg-2 lg:block">
                  {user.displayName?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-fg-2 transition-colors duration-150 hover:text-fg"
              >
                Log out
              </button>
            </div>
          ) : (
            <button onClick={loginWithGoogle} className="btn btn-primary h-9 px-3">
              <GoogleIcon />
              Sign in
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="-mr-3 flex h-11 w-11 items-center justify-center text-fg-2 transition-colors duration-150 hover:text-fg md:hidden"
        >
          {isMenuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full border-b border-line bg-page md:hidden">
          <div className="flex flex-col gap-1 px-4 pt-2 pb-4">
            {links.map(({ to, mobileLabel }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `flex h-11 items-center rounded-lg px-3 text-sm ${isActive ? "bg-raised text-fg" : "text-fg-2"}`
                }
              >
                {mobileLabel}
              </NavLink>
            ))}

            <div className="mt-3 border-t border-line pt-4">
              {user ? (
                <div className="flex items-center justify-between px-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar user={user} size="h-7 w-7" />
                    <span className="truncate text-sm text-fg">{user.displayName}</span>
                  </div>
                  <button
                    onClick={() => { logout(); toggleMenu(); }}
                    className="h-11 shrink-0 pl-4 text-sm text-fg-2"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { loginWithGoogle(); toggleMenu(); }}
                  className="btn btn-primary w-full"
                >
                  <GoogleIcon />
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
