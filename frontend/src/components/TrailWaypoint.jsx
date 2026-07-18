import ResourceIcon from "./ResourceIcon.jsx";

const TrailWaypoint = ({ topic, index, isLast, color }) => {
  return (
    <div className="relative pl-14 pb-10">
      {/* Vertical dotted trail connecting this waypoint to the next */}
      {!isLast && (
        <div
          className="trail-line absolute left-[19px] top-10 bottom-0"
          style={{ color }}
        />
      )}

      {/* Waypoint marker */}
      <div
        className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-parchment shadow-sm ring-4 ring-parchment"
        style={{ backgroundColor: color }}
      >
        {index + 1}
      </div>

      <div className="bg-white/70 border border-trail/10 rounded-xl p-5">
        <h3 className="font-display text-lg text-ink mb-1">{topic.title}</h3>
        {topic.description && (
          <p className="text-sm text-ink/60 mb-4 leading-relaxed">{topic.description}</p>
        )}

        <div className="space-y-2">
          {topic.resources.length === 0 && (
            <p className="text-sm text-ink/40 italic">No resources yet on this waypoint — be the first to add one.</p>
          )}
          {topic.resources.map((r) => (
            <a
              key={r._id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border border-trail/10 px-3 py-2 hover:border-amber hover:bg-amber/5 transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <ResourceIcon type={r.type} />
                <span className="text-sm font-medium text-ink truncate">{r.title}</span>
              </span>
              <span className="text-xs text-ink/40 shrink-0">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrailWaypoint;
