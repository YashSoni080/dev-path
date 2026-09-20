import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  Compass,
  Search,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    info("You have been logged out.");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-trail/95 backdrop-blur-md text-parchment border-b border-trail-dark/40 shadow-sm transition-all">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group py-1">
          <div className="w-9 h-9 rounded-xl bg-amber flex items-center justify-center text-trail-dark shadow-md shadow-amber/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-trail-dark" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight leading-none text-parchment">
              DevPath
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-sage font-medium mt-0.5">
              Curated Trails
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full transition-colors ${
                isActive
                  ? "bg-trail-light/50 text-amber"
                  : "text-parchment/80 hover:text-parchment hover:bg-white/5"
              }`
            }
          >
            Trails
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-colors ${
                isActive
                  ? "bg-trail-light/50 text-amber"
                  : "text-parchment/80 hover:text-parchment hover:bg-white/5"
              }`
            }
          >
            <Search className="w-4 h-4 opacity-70" />
            <span>Search</span>
          </NavLink>

          {user && (
            <NavLink
              to="/add-resource"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-trail-light/50 text-amber"
                    : "text-parchment/80 hover:text-parchment hover:bg-white/5"
                }`
              }
            >
              <PlusCircle className="w-4 h-4 opacity-70" />
              <span>Contribute</span>
            </NavLink>
          )}
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-trail-light/40 border border-sage/20 hover:border-amber/40 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber/40"
                aria-expanded={dropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-amber text-trail-dark font-bold text-xs flex items-center justify-center shadow-inner">
                  {getInitials(user.name)}
                </div>
                <span className="text-parchment/90 max-w-[120px] truncate">{user.name}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-sage transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-ink border border-gray-100 shadow-xl py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-ink/50 uppercase tracking-wider font-mono">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-ink truncate mt-0.5">{user.name}</p>
                    <p className="text-xs text-ink/60 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink/80 hover:bg-parchment/60 hover:text-ink transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-trail" />
                      <span>My Progress & Dashboard</span>
                    </Link>

                    <Link
                      to="/add-resource"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink/80 hover:bg-parchment/60 hover:text-ink transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-trail" />
                      <span>Add New Resource</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-parchment/80 hover:text-amber transition-colors px-3 py-1.5"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-amber text-trail-dark hover:bg-amber/90 shadow-md shadow-amber/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl text-parchment hover:bg-white/5 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-trail-dark/60 bg-trail/95 backdrop-blur-xl px-5 py-5 space-y-4 animate-fade-in">
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-trail-dark/40">
              <div className="w-9 h-9 rounded-full bg-amber text-trail-dark font-bold text-sm flex items-center justify-center">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-parchment truncate">{user.name}</p>
                <p className="text-xs text-sage truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="space-y-1 text-sm font-medium">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-parchment transition-colors"
            >
              <Compass className="w-5 h-5 text-amber" />
              <span>Explore Trails</span>
            </Link>

            <Link
              to="/search"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-parchment transition-colors"
            >
              <Search className="w-5 h-5 text-amber" />
              <span>Search Resources</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-parchment transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 text-amber" />
                  <span>My Progress & Dashboard</span>
                </Link>

                <Link
                  to="/add-resource"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-parchment transition-colors"
                >
                  <PlusCircle className="w-5 h-5 text-amber" />
                  <span>Add Resource</span>
                </Link>

                <div className="pt-2 border-t border-trail-dark/40">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-trail-dark/40 flex flex-col gap-2.5">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-sage/30 text-parchment hover:border-amber transition-colors font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-amber text-trail-dark font-semibold hover:bg-amber/90 transition-colors shadow"
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
