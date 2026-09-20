import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext.jsx";
import {
  Code2,
  Globe,
  Cpu,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const ICON_MAP = {
  dsa: Code2,
  "web-development": Globe,
  "ai-ml": Cpu,
  cybersecurity: ShieldCheck,
};

const DomainCard = ({ domain, topics = [] }) => {
  const { getDomainProgress } = useProgress();
  const Icon = ICON_MAP[domain.slug] || Compass;

  // Calculate progress for this domain if topics are supplied
  const { completedCount, totalCount, percentage } = getDomainProgress(topics);

  return (
    <Link
      to={`/domain/${domain.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-trail/15 bg-white/80 backdrop-blur-sm p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-amber/40 hover:bg-white"
    >
      {/* Decorative colored glow in top right */}
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-20 transition-all duration-300 group-hover:scale-150 group-hover:opacity-30 blur-xl pointer-events-none"
        style={{ backgroundColor: domain.color || "#C97A3D" }}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: domain.color || "#C97A3D" }}
          >
            <Icon className="w-6 h-6" />
          </div>

          {totalCount > 0 && completedCount > 0 && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                percentage === 100
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber/10 text-amber border-amber/20"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {completedCount}/{totalCount}
              </span>
            </span>
          )}
        </div>

        <h3 className="font-display font-semibold text-xl mb-2 text-ink group-hover:text-amber transition-colors">
          {domain.name}
        </h3>

        <p className="text-sm text-ink/70 leading-relaxed line-clamp-3">
          {domain.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-trail/10 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-transform"
          style={{ color: domain.color || "#C97A3D" }}
        >
          <span>Follow trail</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </span>

        {totalCount > 0 && (
          <span className="text-xs font-mono text-ink/40">
            {totalCount} {totalCount === 1 ? "waypoint" : "waypoints"}
          </span>
        )}
      </div>
    </Link>
  );
};

export default DomainCard;
