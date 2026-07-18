import { Link } from "react-router-dom";

const DomainCard = ({ domain }) => {
  return (
    <Link
      to={`/domain/${domain.slug}`}
      className="group relative block rounded-2xl border border-trail/15 bg-white/60 p-6 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ boxShadow: "0 1px 0 rgba(47,75,60,0.08)" }}
    >
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-15 transition-transform group-hover:scale-125"
        style={{ backgroundColor: domain.color }}
      />
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-parchment font-display text-lg mb-4"
          style={{ backgroundColor: domain.color }}
        >
          {domain.name.charAt(0)}
        </div>
        <h3 className="font-display text-xl mb-2 text-ink">{domain.name}</h3>
        <p className="text-sm text-ink/70 leading-relaxed">{domain.description}</p>
        <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: domain.color }}>
          Start the trail
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
};

export default DomainCard;
