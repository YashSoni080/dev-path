import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useProgress } from "../context/ProgressContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import ResourceIcon from "../components/ResourceIcon.jsx";
import {
  User,
  CheckCircle2,
  BookOpen,
  PlusCircle,
  ExternalLink,
  Trash2,
  Copy,
  ArrowRight,
  ShieldCheck,
  Compass,
  Award,
  Layers,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { completedTopics } = useProgress();
  const { success, error: toastError } = useToast();

  const [domains, setDomains] = useState([]);
  const [userResources, setUserResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("progress"); // 'progress' | 'resources'
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        // Fetch domains with their roadmaps to show completed topic details
        const domainsRes = await api.get("/domains");
        const domainList = domainsRes.data;

        // Fetch topics for each domain
        const fullDomains = await Promise.all(
          domainList.map(async (d) => {
            const { data } = await api.get(`/domains/${d.slug}`);
            return {
              ...d,
              topics: data.topics || [],
            };
          })
        );
        setDomains(fullDomains);

        // Fetch all resources and filter user's resources
        const { data: allResources } = await api.get("/resources/search");
        const myResources = allResources.filter(
          (r) =>
            r.addedBy &&
            (r.addedBy._id === user?._id || r.addedBy === user?._id)
        );
        setUserResources(myResources);
      } catch (err) {
        toastError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user, toastError]);

  const handleCopyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      success("Resource link copied!");
    } catch {
      toastError("Failed to copy link");
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    setDeletingId(resourceId);
    try {
      await api.delete(`/resources/${resourceId}`);
      success("Resource deleted.");
      setUserResources((prev) => prev.filter((r) => r._id !== resourceId));
    } catch (err) {
      toastError("Failed to delete resource.");
    } finally {
      setDeletingId(null);
    }
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

  // Calculate statistics
  const totalWaypointsAcrossDomains = domains.reduce(
    (sum, d) => sum + (d.topics?.length || 0),
    0
  );
  const completedCount = completedTopics.length;
  const overallPercentage =
    totalWaypointsAcrossDomains > 0
      ? Math.round((completedCount / totalWaypointsAcrossDomains) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-trail/15 bg-white/80 backdrop-blur-md p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber text-trail-dark font-display font-bold text-2xl flex items-center justify-center shadow-md">
              {getInitials(user?.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-ink">
                  {user?.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-sm text-ink/60 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <Link
            to="/add-resource"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-amber text-trail-dark hover:bg-amber/90 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Resource</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-trail/10">
          <div className="bg-white/60 rounded-2xl p-4 border border-trail/10">
            <span className="text-xs font-mono uppercase text-ink/50 block mb-1">
              Waypoints Cleared
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-3xl text-emerald-700">
                {completedCount}
              </span>
              <span className="text-xs text-ink/40 font-mono">
                / {totalWaypointsAcrossDomains} ({overallPercentage}%)
              </span>
            </div>
          </div>

          <div className="bg-white/60 rounded-2xl p-4 border border-trail/10">
            <span className="text-xs font-mono uppercase text-ink/50 block mb-1">
              Active Trails
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-3xl text-ink">
                {domains.length}
              </span>
              <span className="text-xs text-ink/40 font-mono">domains</span>
            </div>
          </div>

          <div className="bg-white/60 rounded-2xl p-4 border border-trail/10">
            <span className="text-xs font-mono uppercase text-ink/50 block mb-1">
              Resources Contributed
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-3xl text-amber">
                {userResources.length}
              </span>
              <span className="text-xs text-ink/40 font-mono">shared</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-trail/10 mb-6">
        <button
          onClick={() => setActiveTab("progress")}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === "progress"
              ? "border-amber text-ink"
              : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          My Learning Trails
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === "resources"
              ? "border-amber text-ink"
              : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          My Contributions ({userResources.length})
        </button>
      </div>

      {/* Tab: Learning Trails */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          {domains.map((domain) => {
            const domainTopics = domain.topics || [];
            const doneTopics = domainTopics.filter((t) =>
              completedTopics.includes(t._id?.toString())
            );
            const domainPct =
              domainTopics.length > 0
                ? Math.round((doneTopics.length / domainTopics.length) * 100)
                : 0;

            return (
              <div
                key={domain._id}
                className="rounded-2xl border border-trail/10 bg-white/80 p-5 sm:p-6 shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: domain.color || "#C97A3D" }}
                    />
                    <h3 className="font-display font-semibold text-lg text-ink">
                      {domain.name}
                    </h3>
                  </div>

                  <Link
                    to={`/domain/${domain.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color: domain.color || "#C97A3D" }}
                  >
                    <span>Go to trail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-ink/60 mb-1 font-mono">
                    <span>{doneTopics.length} of {domainTopics.length} waypoints completed</span>
                    <span>{domainPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-trail/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${domainPct}%`,
                        backgroundColor: domainPct === 100 ? "#059669" : domain.color || "#C97A3D",
                      }}
                    />
                  </div>
                </div>

                {/* Completed waypoints list */}
                {doneTopics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-trail/5">
                    {doneTopics.map((top) => (
                      <div
                        key={top._id}
                        className="flex items-center gap-2 text-xs text-ink/80 bg-emerald-50/50 border border-emerald-200/50 rounded-lg px-2.5 py-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{top.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink/40 italic">
                    No waypoints marked as completed yet on this trail.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Contributed Resources */}
      {activeTab === "resources" && (
        <div className="space-y-3">
          {userResources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-trail/20 p-12 text-center bg-white/40">
              <BookOpen className="w-10 h-10 text-sage mx-auto mb-3 opacity-50" />
              <h3 className="font-display font-medium text-lg text-ink mb-1">
                You haven't added any resources yet
              </h3>
              <p className="text-sm text-ink/60 max-w-sm mx-auto mb-5">
                Found a great tutorial, official documentation, or problem sheet? Add it to help other learners!
              </p>
              <Link
                to="/add-resource"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-amber text-trail-dark hover:bg-amber/90 transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add a Resource Now</span>
              </Link>
            </div>
          ) : (
            userResources.map((r) => (
              <div
                key={r._id}
                className="rounded-2xl border border-trail/10 bg-white/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-amber/30 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ResourceIcon type={r.type} size="xs" />
                    {r.topic?.domain && (
                      <span className="text-xs text-ink/50 font-mono truncate">
                        {r.topic.domain.name} → {r.topic.title}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-semibold text-ink text-base">
                    {r.title}
                  </h4>
                  {r.description && (
                    <p className="text-xs text-ink/60 mt-1 line-clamp-1">
                      {r.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleCopyLink(r.url)}
                    title="Copy Link"
                    className="p-2 rounded-lg text-ink/40 hover:text-ink hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteResource(r._id)}
                    disabled={deletingId === r._id}
                    title="Delete Resource"
                    className="p-2 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber text-trail-dark hover:bg-amber/90 transition-colors shadow-xs ml-1"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
