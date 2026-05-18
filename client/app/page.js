"use client";

import { useEffect, useState } from "react";
import { fetchJobs } from "../lib/api";
import JobCard from "../components/JobCard";

const CATEGORIES = ["All", "Plumbing", "Electrical", "Painting", "Joinery", "Cleaning", "Gardening", "Other"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {};
        if (category !== "All") filters.category = category;
        const res = await fetchJobs(filters);
        setJobs(res.data);
      } catch (err) {
        setError(err.message || "Could not load jobs from the server.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Service requests
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Service requests board
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Browse requests, filter by category, and open a job to update its status or remove it.
            </p>
          </div>

          <div className="min-w-[220px] lg:w-[260px]">
            <label className="mb-2 block text-sm font-medium text-slate-700">Category filter</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4">
        {!loading && !error && (
          <p className="text-sm text-slate-500">
            {jobs.length} {jobs.length === 1 ? "request" : "requests"} found
            {category !== "All" && ` in ${category}`}
          </p>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="h-8 w-24 rounded-full bg-slate-100" />
                <div className="h-7 w-20 rounded-full bg-slate-100" />
              </div>
              <div className="h-6 w-4/5 rounded bg-slate-100" />
              <div className="mt-3 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-11/12 rounded bg-slate-100" />
              <div className="mt-5 h-4 w-2/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card border-rose-200 bg-rose-50 p-6 text-center">
          <p className="mb-1 font-semibold text-rose-700">Connection Error</p>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="card py-16 text-center">
          <h3 className="font-display text-2xl font-bold text-slate-900">No requests found</h3>
          <p className="mt-2 text-slate-500">Try adjusting your filters or post the first request.</p>
          <div className="mt-6">
            <a href="/jobs/new" className="btn-primary">
              Post a Request
            </a>
          </div>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
