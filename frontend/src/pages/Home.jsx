import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import DomainCard from "../components/DomainCard.jsx";

const Home = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const { data } = await api.get("/domains");
        setDomains(data);
      } catch {
        setError("Couldn't load domains. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="topo-bg border-b border-trail/10">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber mb-4">
            Free resources · No more scattered tabs
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink max-w-2xl mx-auto">
            Stop hunting for the right tutorial. Follow the trail instead.
          </h1>
          <p className="mt-5 text-ink/70 max-w-xl mx-auto leading-relaxed">
            DevPath organizes the best free playlists, docs, and sheets into ordered
            roadmaps for DSA, Web Dev, AI/ML, and Cybersecurity — so you spend your time
            learning, not searching.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-block rounded-full bg-amber text-trail-dark px-6 py-2.5 font-medium hover:bg-amber/90 transition-colors"
            >
              Get started free
            </Link>
            <a
              href="#domains"
              className="inline-block rounded-full border border-trail/20 px-6 py-2.5 font-medium text-ink/70 hover:text-ink hover:border-trail/40 transition-colors"
            >
              Browse trails ↓
            </a>
          </div>
        </div>
      </section>

      {/* Domain grid */}
      <section id="domains" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-ink mb-8">Choose your trail</h2>

        {loading && <p className="text-ink/50">Loading domains…</p>}
        {error && <p className="text-red-700">{error}</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {domains.map((domain) => (
            <DomainCard key={domain._id} domain={domain} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
