"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchJob, updateJobStatus, deleteJob } from "../../../lib/api";
import StatusBadge from "../../../components/StatusBadge";

const CATEGORY_ICONS = {
  Plumbing: "🔧", Electrical: "⚡", Painting: "🎨",
  Joinery: "🪚", Cleaning: "🧹", Gardening: "🌿", Other: "🔨",
};

const STATUSES = ["Open", "In Progress", "Closed"];

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchJob(params.id);
        setJob(res.data);
      } catch (err) {
        setError("Job not found or server is unavailable.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusLoading(true);
    try {
      const res = await updateJobStatus(job._id, newStatus);
      setJob(res.data);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteJob(job._id);
      router.push("/");
    } catch (err) {
      alert("Failed to delete job: " + err.message);
      setDeleteLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card animate-pulse space-y-4">
          <div className="h-6 bg-slate-800 rounded w-1/4" />
          <div className="h-8 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-slate-400 hover:text-sky-400 text-sm mb-6 inline-block">← Back</a>
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="font-display font-bold text-xl text-white mb-2">Job Not Found</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <a href="/" className="text-slate-400 hover:text-sky-400 text-sm transition-colors mb-6 inline-block">
        ← Back to listings
      </a>

      <div className="card">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{CATEGORY_ICONS[job.category] || "🔨"}</span>
            <span className="text-sm text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
              {job.category}
            </span>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-4">
          {job.title}
        </h1>

        <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
          {job.description}
        </p>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-4 bg-slate-800/50 rounded-xl p-4 mb-6 text-sm">
          {job.location && (
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Location</p>
              <p className="text-slate-200">📍 {job.location}</p>
            </div>
          )}
          {job.contactName && (
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Contact</p>
              <p className="text-slate-200">👤 {job.contactName}</p>
            </div>
          )}
          {job.contactEmail && (
            <div className="col-span-2">
              <p className="text-slate-500 text-xs mb-0.5">Email</p>
              <a
                href={`mailto:${job.contactEmail}`}
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                ✉️ {job.contactEmail}
              </a>
            </div>
          )}
          <div className="col-span-2">
            <p className="text-slate-500 text-xs mb-0.5">Posted</p>
            <p className="text-slate-300">🕐 {formatDate(job.createdAt)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-800 pt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Update Status
            </label>
            <select
              value={job.status}
              onChange={handleStatusChange}
              disabled={statusLoading}
              className="input w-auto disabled:opacity-60"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {statusLoading && (
              <span className="text-sky-400 text-xs ml-3">Updating...</span>
            )}
          </div>

          <div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-danger"
              >
                🗑 Delete Request
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-300 font-semibold mb-3">
                  Are you sure you want to delete this job?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
                  >
                    {deleteLoading ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
