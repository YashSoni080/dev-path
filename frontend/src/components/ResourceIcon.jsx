const ICONS = {
  video: { label: "Video", glyph: "▶" },
  playlist: { label: "Playlist", glyph: "▶▶" },
  doc: { label: "Docs", glyph: "▤" },
  sheet: { label: "Sheet", glyph: "▦" },
  article: { label: "Article", glyph: "✎" },
  github: { label: "Practice", glyph: "◈" },
};

const ResourceIcon = ({ type }) => {
  const info = ICONS[type] || { label: type, glyph: "•" };
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full bg-trail/10 text-trail-dark border border-trail/20">
      <span aria-hidden="true">{info.glyph}</span>
      {info.label}
    </span>
  );
};

export default ResourceIcon;
