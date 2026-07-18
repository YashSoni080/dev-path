import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const RESOURCE_TYPES = ["video", "playlist", "doc", "sheet", "article", "github"];

const AddResource = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({
    domainSlug: "",
    topic: "",
    title: "",
    url: "",
    type: "video",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/domains").then(({ data }) => setDomains(data));
  }, []);

  useEffect(() => {
    if (!form.domainSlug) {
      setTopics([]);
      return;
    }
    api.get(`/domains/${form.domainSlug}`).then(({ data }) => {
      setTopics(data.topics);
      setForm((f) => ({ ...f, topic: "" }));
    });
  }, [form.domainSlug]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/resources", {
        topic: form.topic,
        title: form.title,
        url: form.url,
        type: form.type,
        description: form.description,
      });
      setSuccess("Resource added to the trail!");
      setForm((f) => ({ ...f, title: "", url: "", description: "" }));
      setTimeout(() => navigate(`/domain/${form.domainSlug}`), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't add resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-2">Add a resource</h1>
      <p className="text-ink/60 mb-8">Found a great free resource? Add it to the right waypoint.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Domain</label>
          <select
            name="domainSlug"
            required
            value={form.domainSlug}
            onChange={handleChange}
            className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 focus:outline-none focus:border-amber"
          >
            <option value="">Select a domain</option>
            {domains.map((d) => (
              <option key={d._id} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Topic / waypoint</label>
          <select
            name="topic"
            required
            value={form.topic}
            onChange={handleChange}
            disabled={!topics.length}
            className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 focus:outline-none focus:border-amber disabled:opacity-50"
          >
            <option value="">Select a topic</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Resource title</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Complete React Hooks Playlist"
            className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 focus:outline-none focus:border-amber"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">URL</label>
          <input
            type="url"
            name="url"
            required
            value={form.url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 focus:outline-none focus:border-amber"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 focus:outline-none focus:border-amber"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">
            Short description <span className="text-ink/40">(optional)</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 focus:outline-none focus:border-amber"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {success && <p className="text-sm text-trail font-medium">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber text-trail-dark py-2.5 font-medium hover:bg-amber/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add to trail"}
        </button>
      </form>
    </div>
  );
};

export default AddResource;
