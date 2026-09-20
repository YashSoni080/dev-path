import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ResourceIcon from "../components/ResourceIcon.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  Search as SearchIcon,
  X,
  ExternalLink,
  Copy,
  Trash2,
  Filter,
  ArrowRight,
  ShieldCheck,
  User,
  SlidersHorizontal,
} from "lucide-react";

const TYPES = [
  { value: "", label: "All Types" },
  { value: "video", label: "Videos" },
  { value: "playlist", label: "Playlists" },
  { value: "doc", label: "Documentation" },
  { value: "sheet", label: "Sheets" },
  { value: "article", label: "Articles" },
  { value: "github", label: "Repositories" },
];

const DOMAIN_OPTIONS = [
  { slug: "", label: "All Trails" },
  { slug: "dsa", label: "DSA" },
  { slug: "web-development", label: "Web Dev" },
  { slug: "ai-ml", label: "AI/ML" },
  { slug: "cybersecurity", label: "Cybersecurity" },
];

const Search = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchResults = useCallback(async (searchQuery, filterType, filterDomain) => {
    setLoading(true);
    try {
      const { data } = await api.get("/resources/search", {
        params: {
          q: searchQuery || undefined,
          type: filterType || undefined,
          domain: filterDomain || undefined,
        },
      });
      setResults(data);
    } catch {
      toastError("Failed to fetch search results.");
    } finally {
      setLoading(false);
      setInitialLoaded(true);
    }
  }, [toastError]);

  // Debounced search on input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults(q, type, domain);
    }, 250);
    return () => clearTimeout(timer);
  }, [q, type, domain, fetchResults]);

  const handleClearFilters = () => {
    setQ("");
    setType("");
    setDomain("");
  };

  const handleCopyLink = async (e, url) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      success("Resource link copied to clipboard!");
    } catch {
      toastError("Failed to copy link");
    }
  };

  const handleDeleteResource = async (e, resourceId) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    setDeletingId(resourceId);
    try {
      await api.delete(`/resources/${resourceId}`);
      success("Resource removed successfully.");
      setResults((prev) => prev.filter((r) => r._id !== resourceId));
    } catch (err) {
      toastError(err.response?.data?.message || "Could not delete resource.");
    } finally {
      setDeletingId(null);
    }
  };

  const hasActiveFilters = Boolean(q || type || domain);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Search Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink">
          Search the Trails
        </h1>
        <p className="mt-2 text-sm sm:text-base text-ink/70">
          Find curated tutorials, playlists, cheat sheets, and docs across all domains.
        </p>
      </div>

      {/* Main Search Input Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 w-5 h-5 text-ink/40 pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by topic, keyword, or title (e.g. recursion, react, jwt, nmap)…"
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-trail/20 bg-white/90 shadow-sm text-sm sm:text-base text-ink placeholder:text-ink/40 focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3.5 p-1 rounded-full text-ink/40 hover:text-ink hover:bg-gray-100 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-trail/10 shadow-xs">
        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono uppercase text-ink/40 mr-1 hidden sm:inline">
            Domain:
          </span>
          {DOMAIN_OPTIONS.map((d) => (
            <button
              key={d.slug}
              onClick={() => setDomain(d.slug)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                domain === d.slug
                  ? "bg-trail text-parchment shadow-sm"
                  : "bg-white/80 text-ink/70 hover:bg-white hover:text-ink border border-trail/10"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Type Select & Clear Filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-xs font-medium py-1.5 pl-3 pr-8 rounded-full border border-trail/20 bg-white text-ink focus:outline-none focus:border-amber"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header Stats */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs font-mono text-ink/50">
        <span>
          {loading ? (
            "Searching…"
          ) : (
            <>
              Showing <strong>{results.length}</strong> {results.length === 1 ? "resource" : "resources"}
              {hasActiveFilters && " matching criteria"}
            </>
          )}
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {!loading && results.length === 0 && initialLoaded && (
          <div className="rounded-2xl border border-dashed border-trail/20 bg-white/40 p-12 text-center">
            <Filter className="w-10 h-10 text-sage mx-auto mb-3 opacity-50" />
            <h3 className="font-display font-medium text-lg text-ink mb-1">
              No resources match your search
            </h3>
            <p className="text-sm text-ink/60 max-w-sm mx-auto mb-5">
              Try searching with different keywords, selecting "All Trails", or clearing type filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-trail text-parchment hover:bg-trail-dark transition-colors"
              >
                Reset all filters
              </button>
            )}
          </div>
        )}

        {results.map((r) => {
          const isOwner =
            user && r.addedBy && (r.addedBy._id === user._id || r.addedBy === user._id);

          return (
            <div
              key={r._id}
              className="group relative rounded-2xl border border-trail/10 bg-white/90 p-4 sm:p-5 transition-all duration-200 hover:border-amber/40 hover:shadow-md hover:bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Category & Topic Breadcrumb */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <ResourceIcon type={r.type} size="xs" />

                    {r.isMasterCourse && (
                      <span className="text-[10px] font-mono uppercase font-bold text-amber tracking-wider bg-amber/10 px-2 py-0.5 rounded-full border border-amber/20">
                        Full Master Course
                      </span>
                    )}

                    {(r.topic?.domain || r.domain) && (
                      <Link
                        to={`/domain/${(r.topic?.domain || r.domain).slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-amber transition-colors"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              (r.topic?.domain || r.domain).color || "#C97A3D",
                          }}
                        />
                        <span>{(r.topic?.domain || r.domain).name}</span>
                        <span>→</span>
                        <span className="text-ink/80 truncate max-w-[180px]">
                          {r.topic?.title || "A-Z Master Curriculum"}
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Resource Title */}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-semibold text-base sm:text-lg text-ink hover:text-amber transition-colors flex items-center gap-1.5 group/link"
                  >
                    <span>{r.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-ink/40 group-hover/link:text-amber shrink-0 transition-colors" />
                  </a>

                  {/* Description */}
                  {r.description && (
                    <p className="text-sm text-ink/70 mt-1 leading-relaxed line-clamp-2">
                      {r.description}
                    </p>
                  )}

                  {/* Attribution */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-ink/50">
                    {r.addedBy ? (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-sage" />
                        <span>
                          Contributed by{" "}
                          <strong>
                            {typeof r.addedBy === "object" ? r.addedBy.name : "Community"}
                          </strong>
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-trail font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Curated resource</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-1 self-end sm:self-center shrink-0 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={(e) => handleCopyLink(e, r.url)}
                    title="Copy resource URL"
                    className="p-2 rounded-lg text-ink/40 hover:text-ink hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {isOwner && (
                    <button
                      onClick={(e) => handleDeleteResource(e, r._id)}
                      disabled={deletingId === r._id}
                      title="Delete this resource"
                      className="p-2 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber text-trail-dark hover:bg-amber/90 transition-colors shadow-xs ml-1"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
