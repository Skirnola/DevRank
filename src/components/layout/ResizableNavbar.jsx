import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Code2,
  Heart,
  History,
  User,
  Menu,
  X,
  Sparkles,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import LogoutModal from "../LogoutModal";

export const ResizableNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, isGuest } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsOpen(false); // Close mobile menu
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Navigation items - filtered based on authentication
  const navItems = isAuthenticated
    ? [
        { path: "/", icon: Home, label: "Home" },
        { path: "/challenges", icon: Code2, label: "Challenges" },
        { path: "/favorites", icon: Heart, label: "Favorites" },
        { path: "/history", icon: History, label: "History" },
        { path: "/profile", icon: User, label: "Profile" },
      ]
    : [
        { path: "/", icon: Home, label: "Home" },
        { path: "/challenges", icon: Code2, label: "Challenges" },
        { path: "/login", icon: LogIn, label: "Login" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block">
        <div className="bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
          <div
            className={cn(
              "mx-auto px-6 transition-all duration-500 ease-out",
              scrolled ? "max-w-7xl" : "max-w-full"
            )}
          >
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DevRank
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                        active
                          ? "text-purple-400 bg-purple-500/10"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-purple-500/10 border border-purple-500/30 rounded-xl"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <Icon className="h-5 w-5 relative z-10" />
                      <span className="font-medium relative z-10">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}

                {/* Logout Button (when authenticated) */}
                {isAuthenticated && (
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      {/* Bottom Mobile Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800/50">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left Side — nav items */}
          <div className="flex-1 grid auto-cols-fr grid-flow-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2",
                    active
                      ? "text-purple-400"
                      : "text-neutral-500 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right-aligned Logout (only when logged in) */}
          {isAuthenticated && (
            <button
              onClick={handleLogoutClick}
              className="ml-4 flex flex-col items-center justify-center gap-1 py-2 text-neutral-500 hover:text-rose-400"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-[10px] font-medium">Logout</span>
            </button>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isGuest={isGuest}
      />
    </>
  );
};

export default ResizableNavbar;
