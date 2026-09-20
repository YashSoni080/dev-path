import { useState } from "react";
import { Link } from "react-router-dom";
import ResourceIcon from "./ResourceIcon.jsx";
import { useProgress } from "../context/ProgressContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import api from "../api/axios.js";
import {
  Check,
  CheckCircle2,
  Circle,
  ExternalLink,
  Copy,
  Trash2,
  Plus,
  Sparkles,
  User,
  ShieldCheck,
} from "lucide-react";

const TrailWaypoint = ({
  topic,
  index,
  isLast,
  color = "#2F4B3C",
  domainSlug,
  onResourceDeleted,
}) => {
  const { isCompleted, toggleCompleted } = useProgress();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [deletingId, setDeletingId] = useState(null);
  const completed = isCompleted(topic._id);

  const handleCopyLink = async (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      success("Resource link copied to clipboard!");
    } catch {
      toastError("Failed to copy link");
    }
  };

  const handleDeleteResource = async (e, resourceId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setDeletingId(resourceId);
    try {
      await api.delete(`/resources/${resourceId}`);
      success("Resource removed successfully.");
      if (onResourceDeleted) {
        onResourceDeleted(topic._id, resourceId);
      }
    } catch (err) {
      toastError(err.response?.data?.message || "Could not delete resource.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative pl-12 sm:pl-16 pb-12 transition-all">
      {/* Vertical dotted trail connecting this waypoint to the next */}
      {!isLast && (
        <div
          className={`absolute left-[19px] sm:left-[23px] top-12 bottom-0 w-[2px] transition-colors duration-300 ${
            completed ? "bg-emerald-600/40" : "trail-line"
          }`}
          style={{ color: completed ? "#10B981" : color }}
        />
      )}

      {/* Waypoint Status / Number Marker */}
      <button
        onClick={() => toggleCompleted(topic._id, topic.title)}
        title={completed ? "Mark as uncompleted" : "Mark as completed"}
        className={`group absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-display font-bold text-sm sm:text-base shadow-md ring-4 ring-parchment transition-all duration-300 hover:scale-110 cursor-pointer ${
          completed
            ? "bg-emerald-600 text-white shadow-emerald-600/20"
            : "text-white"
        }`}
        style={{ backgroundColor: completed ? "#059669" : color }}
      >
        {completed ? (
          <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] animate-scale-in" />
        ) : (
          <span>{index + 1}</span>
        )}
      </button>

      {/* Waypoint Body Card */}
      <div
        className={`rounded-2xl border transition-all duration-300 p-5 sm:p-6 ${
          completed
            ? "bg-emerald-50/40 border-emerald-300/60 shadow-sm"
            : "bg-white/80 backdrop-blur-sm border-trail/15 shadow-sm hover:shadow-md hover:bg-white"
        }`}
      >
        {/* Waypoint Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-ink/40 font-medium">
                Waypoint {index + 1}
              </span>
              {completed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <h3 className="font-display font-semibold text-xl text-ink mt-0.5">
              {topic.title}
            </h3>
          </div>

          {/* Quick actions: Toggle completion & Add resource to this topic */}
          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              onClick={() => toggleCompleted(topic._id, topic.title)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                completed
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                  : "bg-white text-ink/70 border-trail/20 hover:border-amber hover:text-amber hover:bg-amber/5"
              }`}
            >
              {completed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </>
              )}
            </button>

            {user && (
              <Link
                to={`/add-resource?domain=${domainSlug}&topic=${topic._id}`}
                title="Add resource to this topic"
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full border border-trail/20 bg-white text-ink/70 hover:text-amber hover:border-amber hover:bg-amber/5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </Link>
            )}
          </div>
        </div>

        {topic.description && (
          <p className="text-sm text-ink/70 leading-relaxed mb-5">
            {topic.description}
          </p>
        )}

        {/* Resources Section */}
        <div className="space-y-2.5">
          {(!topic.resources || topic.resources.length === 0) && (
            <div className="rounded-xl border border-dashed border-trail/20 p-4 text-center text-sm text-ink/50 bg-white/40">
              <p>No resources yet for this waypoint.</p>
              {user && (
                <Link
                  to={`/add-resource?domain=${domainSlug}&topic=${topic._id}`}
                  className="inline-flex items-center gap-1 text-amber font-semibold mt-1.5 text-xs hover:underline"
                >
                  <Plus className="w-3 h-3" /> Be the first to contribute
                </Link>
              )}
            </div>
          )}

          {topic.resources &&
            topic.resources.map((r) => {
              const isOwner =
                user &&
                r.addedBy &&
                (r.addedBy._id === user._id || r.addedBy === user._id);

              return (
                <div
                  key={r._id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-trail/10 bg-white/90 p-3.5 transition-all duration-200 hover:border-amber/50 hover:shadow-md hover:bg-white"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="pt-0.5 shrink-0">
                      <ResourceIcon type={r.type} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm text-ink hover:text-amber transition-colors flex items-center gap-1.5 group/link"
                      >
                        <span className="truncate">{r.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-ink/40 group-hover/link:text-amber shrink-0 transition-colors" />
                      </a>

                      {r.description && (
                        <p className="text-xs text-ink/60 line-clamp-1 mt-0.5">
                          {r.description}
                        </p>
                      )}

                      {/* Contributor Pill */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-ink/50">
                        {r.addedBy ? (
                          <span className="inline-flex items-center gap-1 text-ink/60">
                            <User className="w-3 h-3 text-sage" />
                            <span>
                              Contributed by{" "}
                              <strong className="font-semibold text-ink/80">
                                {typeof r.addedBy === "object" ? r.addedBy.name : "Community"}
                              </strong>
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-trail/80 font-medium">
                            <ShieldCheck className="w-3 h-3 text-trail" />
                            <span>Curated resource</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy link & Owner delete */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto justify-end">
                    <button
                      onClick={(e) => handleCopyLink(e, r.url)}
                      title="Copy link"
                      className="p-1.5 rounded-lg text-ink/40 hover:text-ink hover:bg-gray-100 transition-colors"
                      aria-label="Copy resource URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {isOwner && (
                      <button
                        onClick={(e) => handleDeleteResource(e, r._id)}
                        disabled={deletingId === r._id}
                        title="Delete this resource"
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        aria-label="Delete resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber/10 text-amber hover:bg-amber hover:text-trail-dark transition-all ml-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TrailWaypoint;
