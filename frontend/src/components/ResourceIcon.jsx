import {
  Play,
  ListVideo,
  BookOpen,
  FileSpreadsheet,
  FileText,
  GitFork,
  HelpCircle,
} from "lucide-react";

const TYPE_CONFIG = {
  video: {
    label: "Video",
    icon: Play,
    bg: "bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100/80",
    iconColor: "text-rose-600",
  },
  playlist: {
    label: "Playlist",
    icon: ListVideo,
    bg: "bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100/80",
    iconColor: "text-purple-600",
  },
  doc: {
    label: "Documentation",
    icon: BookOpen,
    bg: "bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100/80",
    iconColor: "text-sky-600",
  },
  sheet: {
    label: "Practice Sheet",
    icon: FileSpreadsheet,
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80",
    iconColor: "text-emerald-600",
  },
  article: {
    label: "Article",
    icon: FileText,
    bg: "bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/80",
    iconColor: "text-amber-600",
  },
  github: {
    label: "Repository",
    icon: GitFork,
    bg: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200/80",
    iconColor: "text-slate-600",
  },
};

const ResourceIcon = ({ type, showLabel = true, size = "sm" }) => {
  const config = TYPE_CONFIG[type] || {
    label: type || "Resource",
    icon: HelpCircle,
    bg: "bg-gray-100 text-gray-700 border-gray-200",
    iconColor: "text-gray-500",
  };

  const Icon = config.icon;
  const iconSize = size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${
        size === "xs" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      } ${config.bg}`}
      title={config.label}
    >
      <Icon className={`${iconSize} ${config.iconColor} shrink-0`} aria-hidden="true" />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export default ResourceIcon;
