"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchJob, updateJobStatus, deleteJob } from "../../../lib/api";
import StatusBadge from "../../../components/StatusBadge";

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
          <div className="h-6 bg-slate-100 rounded w-1/4" />
          <div className="h-8 bg-slate-100 rounded w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-sm mb-6 inline-block text-slate-500 hover:text-blue-600 transition-colors">Back</a>
        <div className="card text-center py-12">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Job Not Found</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <a href="/" className="mb-6 inline-block text-sm text-slate-500 transition-colors hover:text-blue-600">
        Back to listings
      </a>

      <div className="card">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
              {job.category}
            </span>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl mb-4">
          {job.title}
        </h1>

        <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
          {job.description}
        </p>

        {/* Meta */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6 text-sm sm:grid-cols-2">
          {job.location && (
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Location</p>
              <p className="text-slate-800">{job.location}</p>
            </div>
          )}
          {job.contactName && (
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Contact</p>
              <p className="text-slate-800">{job.contactName}</p>
            </div>
          )}
          {job.contactEmail && (
            <div className="col-span-2">
              <p className="text-slate-500 text-xs mb-0.5">Email</p>
              <a
                href={`mailto:${job.contactEmail}`}
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                {job.contactEmail}
              </a>
            </div>
          )}
          <div className="col-span-2">
            <p className="text-slate-500 text-xs mb-0.5">Posted</p>
            <p className="text-slate-800">{formatDate(job.createdAt)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 pt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
              <span className="text-blue-600 text-xs ml-3">Updating...</span>
            )}
          </div>

          <div>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-danger"
              >
                Delete Request
              </button>
            ) : (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 px-4 backdrop-blur-sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <div
                  className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
                  onClick={(event) => event.stopPropagation()}
                >
                  <p className="mb-2 text-lg font-display font-bold text-slate-900">
                    Delete this request?
                  </p>
                  <p className="mb-5 text-sm leading-6 text-slate-600">
                    This action cannot be undone. The request will be removed from the board.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="btn-danger flex-1"
                    >
                      {deleteLoading ? "Deleting..." : "Yes, delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
