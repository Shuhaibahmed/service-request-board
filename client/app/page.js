"use client";

import { useState, useEffect } from "react";
import { fetchJobs } from "../lib/api";
import JobCard from "../components/JobCard";

const CATEGORIES = ["All", "Plumbing", "Electrical", "Painting", "Joinery", "Cleaning", "Gardening", "Other"];
const STATUSES = ["All", "Open", "In Progress", "Closed"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {};
        if (category !== "All") filters.category = category;
        if (status !== "All") filters.status = status;
        if (search) filters.search = search;
        const res = await fetchJobs(filters);
        setJobs(res.data);
      } catch (err) {
        setError(err.message || "Could not load jobs from the server.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, status, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-3">
          Service Requests
        </h1>
        <p className="text-slate-400 text-lg">
          Browse open jobs and connect with homeowners who need your skills.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search jobs by keyword..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input flex-1"
        />
        <button type="submit" className="btn-primary">Search</button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); }}
            className="btn-secondary"
          >
            Clear
          </button>
        )}
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div>
          <label className="block text-xs text-slate-500 mb-1 ml-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input py-2 pr-8 w-auto"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1 ml-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input py-2 pr-8 w-auto"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <p className="text-slate-500 text-sm mb-5">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
          {search && ` for "${search}"`}
          {category !== "All" && ` in ${category}`}
          {status !== "All" && ` • ${status}`}
        </p>
      )}

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/3 mb-3" />
              <div className="h-6 bg-slate-800 rounded w-4/5 mb-2" />
              <div className="h-4 bg-slate-800 rounded w-full mb-1" />
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400 font-semibold mb-1">⚠️ Connection Error</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="font-display font-bold text-xl text-slate-300 mb-2">No jobs found</h3>
          <p className="text-slate-500">Try adjusting your filters or be the first to post a request.</p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
