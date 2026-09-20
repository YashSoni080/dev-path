import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import TrailWaypoint from "../components/TrailWaypoint.jsx";
import ResourceIcon from "../components/ResourceIcon.jsx";
import { useProgress } from "../context/ProgressContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  ArrowLeft,
  PlusCircle,
  CheckCircle2,
  ListFilter,
  Sparkles,
  Compass,
  Code2,
  Globe,
  Cpu,
  ShieldCheck,
  Trophy,
  ExternalLink,
  Copy,
  Trash2,
  Layers,
} from "lucide-react";

const ICON_MAP = {
  dsa: Code2,
  "web-development": Globe,
  "ai-ml": Cpu,
  cybersecurity: ShieldCheck,
};

const DomainPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { isCompleted, getDomainProgress } = useProgress();
  const { success: toastSuccess, error: toastError } = useToast();

  const [domain, setDomain] = useState(null);
  const [masterResources, setMasterResources] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'remaining' | 'completed'
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchDomain = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/domains/${slug}`);
        setDomain(data.domain);
        setMasterResources(data.masterResources || []);
        setTopics(data.topics || []);
      } catch (err) {
        setError(err.response?.data?.message || "Couldn't find this trail.");
      } finally {
        setLoading(false);
      }
    };
    fetchDomain();
  }, [slug]);

  // Handle optimistic deletion of waypoint resources
  const handleResourceDeleted = (topicId, resourceId) => {
    setTopics((prevTopics) =>
      prevTopics.map((top) => {
        if (top._id !== topicId) return top;
        return {
          ...top,
          resources: (top.resources || []).filter((r) => r._id !== resourceId),
        };
      })
    );
  };

  // Handle deletion of master resources
  const handleDeleteMasterResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this master course?")) return;
    setDeletingId(resourceId);
    try {
      await api.delete(`/resources/${resourceId}`);
      toastSuccess("Master course removed.");
      setMasterResources((prev) => prev.filter((r) => r._id !== resourceId));
    } catch (err) {
      toastError("Failed to delete master course.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toastSuccess("Link copied to clipboard!");
    } catch {
      toastError("Failed to copy link");
    }
  };

  const { completedCount, totalCount, percentage } = useMemo(
    () => getDomainProgress(topics),
    [topics, getDomainProgress]
  );

  const filteredTopics = useMemo(() => {
    if (filter === "completed") {
      return topics.filter((t) => isCompleted(t._id));
    }
    if (filter === "remaining") {
      return topics.filter((t) => !isCompleted(t._id));
    }
    return topics;
  }, [topics, filter, isCompleted]);

  const Icon = (domain && ICON_MAP[domain.slug]) || Compass;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-pulse">
        <div className="h-6 w-28 bg-trail/10 rounded mb-8"></div>
        <div className="h-20 w-full bg-trail/10 rounded-3xl mb-8"></div>
        <div className="h-44 w-full bg-white/50 rounded-3xl border border-trail/10 mb-8"></div>
        <div className="space-y-6">
          <div className="h-32 bg-white/50 rounded-2xl border border-trail/10"></div>
          <div className="h-32 bg-white/50 rounded-2xl border border-trail/10"></div>
        </div>
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl text-ink mb-2">Trail not found</h2>
        <p className="text-sm text-ink/60 mb-6">{error || "The requested trail does not exist."}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-trail text-parchment px-6 py-2.5 font-medium hover:bg-trail-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to base camp</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Back Link & Quick Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All trails</span>
        </Link>

        {user && (
          <Link
            to={`/add-resource?domain=${domain.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-amber text-trail-dark hover:bg-amber/90 transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Resource</span>
          </Link>
        )}
      </div>

      {/* Domain Header Hero */}
      <div className="relative rounded-3xl border border-trail/15 bg-white/85 backdrop-blur-md p-6 sm:p-8 mb-10 shadow-sm overflow-hidden">
        <div
          className="absolute -right-10 -top-10 w-44 h-44 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{ backgroundColor: domain.color || "#C97A3D" }}
        />

        <div className="flex items-start gap-4 sm:gap-6">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
            style={{ backgroundColor: domain.color || "#C97A3D" }}
          >
            <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-ink/40 font-semibold">
                Curated Trail
              </span>
              {percentage === 100 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Trail Completed!
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
              {domain.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-ink/70 leading-relaxed max-w-2xl">
              {domain.description}
            </p>
          </div>
        </div>

        {/* Progress Bar Component */}
        <div className="mt-6 pt-5 border-t border-trail/10">
          <div className="flex items-center justify-between text-xs font-medium text-ink/70 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber" />
              <span>Trail Progress</span>
            </span>
            <span className="font-mono">
              <strong>{completedCount}</strong> of <strong>{totalCount}</strong> waypoints completed ({percentage}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-trail/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor: percentage === 100 ? "#059669" : domain.color || "#C97A3D",
              }}
            />
          </div>
        </div>
      </div>

      {/* 🏆 COMPLETE A-TO-Z MASTER COURSES & ROADMAPS SECTION */}
      {masterResources.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber/15 text-amber flex items-center justify-center shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-ink leading-none">
                Complete A-to-Z Master Courses & Curricula
              </h2>
              <p className="text-xs text-ink/60 mt-0.5">
                Comprehensive full-length courses, companion sheets, and master roadmaps spanning this entire subject.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masterResources.map((mr) => {
              const isOwner =
                user &&
                mr.addedBy &&
                (mr.addedBy._id === user._id || mr.addedBy === user._id);

              return (
                <div
                  key={mr._id}
                  className="group relative flex flex-col justify-between rounded-2xl border-2 border-amber/30 bg-gradient-to-br from-white/95 to-amber/5 p-5 shadow-sm transition-all duration-200 hover:border-amber hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <ResourceIcon type={mr.type} size="xs" />
                      <span className="text-[10px] font-mono uppercase font-bold text-amber tracking-wider bg-amber/10 px-2 py-0.5 rounded-full border border-amber/20">
                        Full Course
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-base sm:text-lg text-ink group-hover:text-amber transition-colors">
                      {mr.title}
                    </h3>

                    {mr.description && (
                      <p className="text-xs sm:text-sm text-ink/70 mt-1.5 leading-relaxed">
                        {mr.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber/15 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyLink(mr.url)}
                        title="Copy link"
                        className="p-1.5 rounded-lg text-ink/40 hover:text-ink hover:bg-amber/10 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => handleDeleteMasterResource(mr._id)}
                          disabled={deletingId === mr._id}
                          title="Delete master course"
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <a
                      href={mr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber text-trail-dark hover:bg-amber/90 transition-all shadow-xs"
                    >
                      <span>Open Course</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🧭 ORDERED STEP-BY-STEP WAYPOINT SECTION HEADER */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-trail/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-trail" />
              <h2 className="font-display font-bold text-xl text-ink">
                Step-by-Step Waypoint Trail
              </h2>
            </div>
            <p className="text-xs text-ink/60 mt-0.5">
              Follow each waypoint in order. Master the targeted topic before moving to the next.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                filter === "all"
                  ? "bg-trail text-parchment shadow-sm"
                  : "text-ink/60 hover:text-ink hover:bg-black/5"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter("remaining")}
              className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                filter === "remaining"
                  ? "bg-trail text-parchment shadow-sm"
                  : "text-ink/60 hover:text-ink hover:bg-black/5"
              }`}
            >
              Remaining ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                filter === "completed"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-ink/60 hover:text-ink hover:bg-black/5"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Waypoints Trail List */}
      <div>
        {filteredTopics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-trail/20 p-12 text-center bg-white/40">
            <CheckCircle2 className="w-10 h-10 text-sage mx-auto mb-3 opacity-60" />
            <h3 className="font-display font-medium text-lg text-ink mb-1">
              No waypoints match this filter
            </h3>
            <p className="text-sm text-ink/60 mb-4">
              {filter === "completed"
                ? "You haven't completed any waypoints on this trail yet. Start by checking off the first waypoint!"
                : "Great work! You have completed all waypoints on this trail."}
            </p>
            <button
              onClick={() => setFilter("all")}
              className="text-xs font-semibold text-amber hover:underline"
            >
              View all waypoints →
            </button>
          </div>
        ) : (
          filteredTopics.map((topic, i) => (
            <TrailWaypoint
              key={topic._id}
              topic={topic}
              index={topics.findIndex((t) => t._id === topic._id)}
              isLast={i === filteredTopics.length - 1}
              color={domain.color}
              domainSlug={domain.slug}
              onResourceDeleted={handleResourceDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DomainPage;
