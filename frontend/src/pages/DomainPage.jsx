import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import TrailWaypoint from "../components/TrailWaypoint.jsx";

const DomainPage = () => {
  const { slug } = useParams();
  const [domain, setDomain] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDomain = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/domains/${slug}`);
        setDomain(data.domain);
        setTopics(data.topics);
      } catch (err) {
        setError("Couldn't find this trail.");
      } finally {
        setLoading(false);
      }
    };
    fetchDomain();
  }, [slug]);

  if (loading) return <p className="max-w-3xl mx-auto px-6 py-16 text-ink/50">Loading trail…</p>;
  if (error) return <p className="max-w-3xl mx-auto px-6 py-16 text-red-700">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <Link to="/" className="text-sm text-ink/50 hover:text-amber transition-colors">
        ← All trails
      </Link>

      <div className="mt-4 mb-10">
        <h1 className="font-display text-3xl text-ink">{domain.name}</h1>
        <p className="mt-2 text-ink/60 max-w-xl leading-relaxed">{domain.description}</p>
      </div>

      <div>
        {topics.map((topic, i) => (
          <TrailWaypoint
            key={topic._id}
            topic={topic}
            index={i}
            isLast={i === topics.length - 1}
            color={domain.color}
          />
        ))}
      </div>
    </div>
  );
};

export default DomainPage;
