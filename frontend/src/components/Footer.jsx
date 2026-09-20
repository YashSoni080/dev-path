import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-trail/10 bg-parchmentDark/30 mt-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-trail/10">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber flex items-center justify-center text-trail-dark">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-ink">
                DevPath
              </span>
            </Link>
            <p className="text-xs text-ink/70 leading-relaxed">
              Organizing the web's best free developer education into structured, ordered learning trails.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-medium">
            <div>
              <p className="font-mono uppercase tracking-wider text-ink/40 mb-3">
                Trails
              </p>
              <ul className="space-y-2 text-ink/70">
                <li>
                  <Link to="/domain/dsa" className="hover:text-amber transition-colors">
                    Data Structures & Algo
                  </Link>
                </li>
                <li>
                  <Link to="/domain/web-development" className="hover:text-amber transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link to="/domain/ai-ml" className="hover:text-amber transition-colors">
                    Artificial Intelligence
                  </Link>
                </li>
                <li>
                  <Link to="/domain/cybersecurity" className="hover:text-amber transition-colors">
                    Cybersecurity
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono uppercase tracking-wider text-ink/40 mb-3">
                Explore
              </p>
              <ul className="space-y-2 text-ink/70">
                <li>
                  <Link to="/search" className="hover:text-amber transition-colors">
                    Search Resources
                  </Link>
                </li>
                <li>
                  <Link to="/add-resource" className="hover:text-amber transition-colors">
                    Contribute Material
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-amber transition-colors">
                    Learning Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono uppercase tracking-wider text-ink/40 mb-3">
                Platform
              </p>
              <ul className="space-y-2 text-ink/70">
                <li>
                  <span className="text-ink/50">MERN Stack Architecture</span>
                </li>
                <li>
                  <span className="text-ink/50">100% Free Resources</span>
                </li>
                <li>
                  <span className="text-ink/50">Community Driven</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink/50">
          <p>
            © {new Date().getFullYear()} DevPath. Built for developers worldwide.
          </p>
          <p className="flex items-center gap-1">
            <span>All roadmaps link to original, free content creators.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
