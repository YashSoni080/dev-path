import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useToast } from "../context/ToastContext.jsx";
import {
  PlusCircle,
  ArrowLeft,
  Link2,
  BookOpen,
  Play,
  ListVideo,
  FileSpreadsheet,
  FileText,
  GitFork,
  Sparkles,
} from "lucide-react";

const RESOURCE_TYPES = [
  { id: "video", label: "Video", icon: Play, desc: "Single YouTube/lecture video" },
  { id: "playlist", label: "Playlist", icon: ListVideo, desc: "Structured video course" },
  { id: "doc", label: "Documentation", icon: BookOpen, desc: "Official reference or docs" },
  { id: "sheet", label: "Practice Sheet", icon: FileSpreadsheet, desc: "Problem tracker or sheet" },
  { id: "article", label: "Article", icon: FileText, desc: "Guide, blog post, or tutorial" },
  { id: "github", label: "Repository", icon: GitFork, desc: "Open-source code or exercises" },
];

const AddResource = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error: toastError } = useToast();

  const preselectedDomain = searchParams.get("domain") || "";
  const preselectedTopic = searchParams.get("topic") || "";

  const [domains, setDomains] = useState([]);
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({
    domainSlug: preselectedDomain,
    topic: preselectedTopic,
    title: "",
    url: "",
    type: "video",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch domains on mount
  useEffect(() => {
    api.get("/domains").then(({ data }) => setDomains(data)).catch(() => {});
  }, []);

  // Fetch topics when domain changes
  useEffect(() => {
    if (!form.domainSlug) {
      setTopics([]);
      return;
    }
    api.get(`/domains/${form.domainSlug}`).then(({ data }) => {
      setTopics(data.topics || []);
      // If we had a preselected topic that belongs to this domain, keep it; otherwise reset
      if (preselectedTopic && data.topics?.some((t) => t._id === preselectedTopic)) {
        setForm((f) => ({ ...f, topic: preselectedTopic }));
      } else if (!form.topic) {
        setForm((f) => ({ ...f, topic: "" }));
      }
    });
  }, [form.domainSlug, preselectedTopic]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTypeSelect = (typeId) => {
    setForm((f) => ({ ...f, type: typeId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let urlToSubmit = form.url.trim();
    if (!urlToSubmit.startsWith("http://") && !urlToSubmit.startsWith("https://")) {
      urlToSubmit = `https://${urlToSubmit}`;
    }

    try {
      new URL(urlToSubmit);
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    setLoading(true);
    try {
      await api.post("/resources", {
        topic: form.topic,
        title: form.title.trim(),
        url: urlToSubmit,
        type: form.type,
        description: form.description.trim(),
      });

      success("Resource successfully added to the trail! 🎉");
      navigate(`/domain/${form.domainSlug}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add resource.";
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link
        to={form.domainSlug ? `/domain/${form.domainSlug}` : "/"}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-amber transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to trail</span>
      </Link>

      <div className="rounded-3xl border border-trail/15 bg-white/90 backdrop-blur-md p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/15 text-amber flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
              Contribute a Resource
            </h1>
            <p className="text-xs sm:text-sm text-ink/60 mt-0.5">
              Help your fellow learners by adding a high-quality free resource.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Domain Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5">
                Domain / Trail *
              </label>
              <select
                name="domainSlug"
                required
                value={form.domainSlug}
                onChange={handleChange}
                className="w-full rounded-xl border border-trail/20 bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              >
                <option value="">Select a domain</option>
                {domains.map((d) => (
                  <option key={d._id} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Waypoint Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5">
                Waypoint / Topic *
              </label>
              <select
                name="topic"
                required
                disabled={!topics.length}
                value={form.topic}
                onChange={handleChange}
                className="w-full rounded-xl border border-trail/20 bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 disabled:opacity-50"
              >
                <option value="">
                  {form.domainSlug ? "Select a waypoint" : "Choose domain first"}
                </option>
                {topics.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Selector Grid */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5">
              Resource Format *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {RESOURCE_TYPES.map((t) => {
                const Icon = t.icon;
                const isSelected = form.type === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => handleTypeSelect(t.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-amber/10 border-amber text-ink shadow-xs ring-1 ring-amber"
                        : "bg-white/60 border-trail/10 text-ink/70 hover:bg-white hover:border-trail/30"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-amber" : "text-ink/40"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">{t.label}</p>
                      <p className="text-[10px] text-ink/50 truncate">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5">
              Resource Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Complete React Hooks & Custom Hooks Playlist"
              className="w-full rounded-xl border border-trail/20 bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
            />
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5">
              Direct URL *
            </label>
            <div className="relative flex items-center">
              <Link2 className="w-4 h-4 text-ink/40 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                name="url"
                required
                value={form.url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/... or docs link"
                className="w-full rounded-xl border border-trail/20 bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5">
              Notes / Why is this helpful? <span className="text-ink/40">(optional)</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Starts from zero, covers memory optimization, real-world examples."
              className="w-full rounded-xl border border-trail/20 bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !form.topic || !form.title || !form.url}
            className="w-full rounded-full bg-amber text-trail-dark py-3 font-semibold text-sm hover:bg-amber/90 transition-all shadow-md shadow-amber/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Adding to Trail…</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Add Resource to Waypoint</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResource;
