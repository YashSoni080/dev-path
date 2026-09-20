import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import DomainCard from "../components/DomainCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useProgress } from "../context/ProgressContext.jsx";
import {
  Compass,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { completedTopics } = useProgress();
  const navigate = useNavigate();

  const [domainsWithTopics, setDomainsWithTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroSearch, setHeroSearch] = useState("");

  useEffect(() => {
    const fetchDomainsAndTopics = async () => {
      try {
        const { data: domains } = await api.get("/domains");

        // Fetch each domain's roadmap topics for progress calculations
        const domainsData = await Promise.all(
          domains.map(async (d) => {
            try {
              const { data } = await api.get(`/domains/${d.slug}`);
              return {
                domain: d,
                topics: data.topics || [],
              };
            } catch {
              return { domain: d, topics: [] };
            }
          })
        );

        setDomainsWithTopics(domainsData);
      } catch {
        setError("Couldn't connect to backend. Please check if server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomainsAndTopics();
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/search");
    }
  };

  const totalWaypoints = domainsWithTopics.reduce(
    (acc, curr) => acc + curr.topics.length,
    0
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative topo-bg border-b border-trail/10 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-trail/15 text-xs font-mono text-trail-dark font-medium mb-6 shadow-xs backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            <span>Curated Free Resources · Zero Fluff · Structured Trails</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.15] text-ink max-w-3xl mx-auto tracking-tight">
            Stop hunting for tutorials. <br className="hidden sm:inline" />
            <span className="text-amber">Follow the trail</span> instead.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-ink/70 max-w-2xl mx-auto leading-relaxed">
            DevPath organizes the world's best free YouTube courses, official documentation,
            and practice sheets into ordered roadmaps for <strong>DSA</strong>,{" "}
            <strong>Web Development</strong>, <strong>AI/ML</strong>, and{" "}
            <strong>Cybersecurity</strong>.
          </p>

          {/* Hero Instant Search Bar */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="mt-8 max-w-xl mx-auto flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl border border-trail/20 p-2 shadow-lg hover:border-amber/40 focus-within:border-amber focus-within:ring-2 focus-within:ring-amber/20 transition-all"
          >
            <Search className="w-5 h-5 text-ink/40 ml-2.5 shrink-0" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search playlists, sheets, or topics (e.g. React, DP, Linux)…"
              className="w-full bg-transparent px-2 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-trail text-parchment px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-trail-dark transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center items-center">
            <a
              href="#trails"
              className="inline-flex items-center gap-2 rounded-full bg-amber text-trail-dark px-6 py-3 font-semibold text-sm hover:bg-amber/90 transition-all shadow-md shadow-amber/20 hover:-translate-y-0.5"
            >
              <span>Explore All Trails</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {user ? (
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-trail/20 bg-white/60 backdrop-blur-sm px-6 py-3 font-semibold text-sm text-ink/80 hover:text-ink hover:border-trail/40 transition-all"
              >
                <span>My Dashboard</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-trail/20 bg-white/60 backdrop-blur-sm px-6 py-3 font-semibold text-sm text-ink/80 hover:text-ink hover:border-trail/40 transition-all"
              >
                <span>Track Progress (Free)</span>
              </Link>
            )}
          </div>

          {/* Feature Badges */}
          <div className="mt-14 pt-10 border-t border-trail/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/40 border border-trail/10">
              <BookOpen className="w-5 h-5 text-amber shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-xs text-ink">Free Resources</h4>
                <p className="text-[11px] text-ink/60 mt-0.5">100% verified & open</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/40 border border-trail/10">
              <MapPin className="w-5 h-5 text-trail shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-xs text-ink">Ordered Waypoints</h4>
                <p className="text-[11px] text-ink/60 mt-0.5">Learn in logical sequence</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/40 border border-trail/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-xs text-ink">Progress Tracking</h4>
                <p className="text-[11px] text-ink/60 mt-0.5">Check off completed topics</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/40 border border-trail/10">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-xs text-ink">Community Powered</h4>
                <p className="text-[11px] text-ink/60 mt-0.5">Add & review materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trails Section */}
      <section id="trails" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber font-semibold mb-1">
              <Compass className="w-4 h-4" />
              <span>Choose Your Journey</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
              Curated Roadmap Trails
            </h2>
          </div>

          {completedTopics.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-ink/70 bg-white/80 border border-trail/15 px-3.5 py-2 rounded-full shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>{completedTopics.length}</strong> of {totalWaypoints} waypoints completed overall
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-white/60 border border-trail/10 p-6"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-center text-rose-700 max-w-md mx-auto">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {domainsWithTopics.map(({ domain, topics }) => (
              <DomainCard key={domain._id} domain={domain} topics={topics} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
