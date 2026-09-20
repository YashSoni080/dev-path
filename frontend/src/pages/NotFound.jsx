import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
      <div className="w-16 h-16 rounded-3xl bg-amber/15 text-amber flex items-center justify-center mx-auto mb-6 shadow-inner">
        <Compass className="w-8 h-8 rotate-45" />
      </div>

      <p className="font-mono text-4xl sm:text-5xl font-bold text-ink/20 tracking-wider mb-2">
        404
      </p>

      <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-3">
        Trail Not Found
      </h1>

      <p className="text-sm text-ink/70 leading-relaxed mb-8">
        Looks like you stepped off the marked path. The waypoint you are looking for has either moved or never existed.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-trail text-parchment px-6 py-2.5 font-medium hover:bg-trail-dark transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Base Camp</span>
        </Link>

        <Link
          to="/search"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-trail/20 bg-white px-6 py-2.5 font-medium text-ink/80 hover:text-ink hover:border-trail/40 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search Resources</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;