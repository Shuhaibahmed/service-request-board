import StatusBadge from "./StatusBadge";
import Link from "next/link";

const CATEGORY_ICONS = {
  Plumbing: "🔧",
  Electrical: "⚡",
  Painting: "🎨",
  Joinery: "🪚",
  Cleaning: "🧹",
  Gardening: "🌿",
  Other: "🔨",
};

export default function JobCard({ job }) {
  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="card cursor-pointer hover:shadow-lg hover:shadow-sky-500/5 group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{CATEGORY_ICONS[job.category] || "🔨"}</span>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">
              {job.category || "Other"}
            </span>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <h2 className="font-display font-bold text-white text-lg mb-2 group-hover:text-sky-400 transition-colors line-clamp-2">
          {job.title}
        </h2>

        <p className="text-slate-400 text-sm line-clamp-2 mb-4">{job.description}</p>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-3">
            {job.location && (
              <span className="flex items-center gap-1">
                <span>📍</span> {job.location}
              </span>
            )}
            {job.contactName && (
              <span className="flex items-center gap-1">
                <span>👤</span> {job.contactName}
              </span>
            )}
          </div>
          <span>{timeAgo(job.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
