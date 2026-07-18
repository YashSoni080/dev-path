import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-trail text-parchment border-b border-trail-dark">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M13 2 L23 22 L13 17 L3 22 Z"
              fill="#C97A3D"
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </svg>
          <span className="font-display text-xl tracking-tight">DevPath</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/search" className="hover:text-amber transition-colors">
            Search
          </Link>
          {user ? (
            <>
              <Link to="/add-resource" className="hover:text-amber transition-colors">
                Add resource
              </Link>
              <span className="hidden sm:inline text-sage font-mono text-xs">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full border border-sage/50 hover:border-amber hover:text-amber transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-amber transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-amber text-trail-dark font-medium hover:bg-amber/90 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
