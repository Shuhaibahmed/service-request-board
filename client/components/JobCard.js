import StatusBadge from "./StatusBadge";
import Link from "next/link";

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
      <div className="card cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 items-center rounded-full bg-blue-50 px-3 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
              {job.category || "Other"}
            </span>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <h2 className="font-display text-lg font-bold text-slate-900 mb-2 transition-colors group-hover:text-blue-700 line-clamp-2">
          {job.title}
        </h2>

        <p className="text-sm leading-6 text-slate-600 line-clamp-2 mb-4">{job.description}</p>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> {job.location}
              </span>
            )}
            {job.contactName && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" /> {job.contactName}
              </span>
            )}
          </div>
          <span>{timeAgo(job.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
