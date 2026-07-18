import { useState } from "react";
import api from "../api/axios.js";
import ResourceIcon from "../components/ResourceIcon.jsx";

const TYPES = ["", "video", "playlist", "doc", "sheet", "article", "github"];

const Search = () => {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get("/resources/search", { params: { q, type } });
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-ink mb-2">Search the trails</h1>
      <p className="text-ink/60 mb-8">Find a specific resource across every domain.</p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or keyword…"
          className="flex-1 rounded-lg border border-trail/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:border-amber"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-trail/20 bg-white/70 px-3 py-2.5 focus:outline-none focus:border-amber"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t ? t : "All types"}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-trail text-parchment px-6 py-2.5 font-medium hover:bg-trail-dark transition-colors"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-ink/50">Searching…</p>}

      {!loading && searched && results.length === 0 && (
        <p className="text-ink/50">No resources matched your search.</p>
      )}

      <div className="space-y-3">
        {results.map((r) => (
          <a
            key={r._id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-trail/10 bg-white/70 p-4 hover:border-amber hover:bg-amber/5 transition-colors"
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <h3 className="font-medium text-ink">{r.title}</h3>
              <ResourceIcon type={r.type} />
            </div>
            {r.description && <p className="text-sm text-ink/60 mb-1">{r.description}</p>}
            {r.topic?.domain && (
              <p className="text-xs text-ink/40 font-mono">
                {r.topic.domain.name} → {r.topic.title}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Search;
