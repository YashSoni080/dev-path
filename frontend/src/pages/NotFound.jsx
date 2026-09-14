import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <p className="font-mono text-5xl text-ink/20 mb-4">404</p>
      <h1 className="font-display text-3xl text-ink mb-2">Trail not found</h1>
      <p className="text-ink/60 mb-8">
        Looks like you wandered off the map. This page doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block rounded-full bg-trail text-parchment px-6 py-2.5 font-medium hover:bg-trail-dark transition-colors"
      >
        Back to base camp
      </Link>
    </div>
  );
};

export default NotFound;