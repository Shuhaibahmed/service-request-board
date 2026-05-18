"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "../../../lib/api";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "Cleaning", "Gardening", "Other"];

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Plumbing",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters";

    if (!form.description.trim()) newErrors.description = "Description is required";
    else if (form.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";

    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await createJob(form);
      router.push(`/jobs/${res.data._id}`);
    } catch (err) {
      setError(err.message || "Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = "text", placeholder, required, rows }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label} {required && <span className="text-sky-400">*</span>}
      </label>
      {rows ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`input resize-none ${errors[name] ? "border-red-500 focus:ring-red-500" : ""}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input ${errors[name] ? "border-red-500 focus:ring-red-500" : ""}`}
        />
      )}
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <a href="/" className="text-slate-400 hover:text-sky-400 text-sm transition-colors mb-4 inline-block">
          ← Back to listings
        </a>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
          Post a Service Request
        </h1>
        <p className="text-slate-400">Describe what you need and connect with tradespeople.</p>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Job Title"
            name="title"
            placeholder="e.g. Leaking kitchen tap needs urgent repair"
            required
          />

          <Field
            label="Description"
            name="description"
            placeholder="Describe the job in detail — location in the house, urgency, any specific requirements..."
            required
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Category <span className="text-sky-400">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <Field
              label="Location"
              name="location"
              placeholder="e.g. Glasgow"
            />
          </div>

          <div className="border-t border-slate-800 pt-5">
            <p className="text-sm text-slate-400 mb-4">Contact Information (optional)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Your Name" name="contactName" placeholder="John Smith" />
              <Field label="Email Address" name="contactEmail" type="email" placeholder="john@example.com" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Posting..." : "Post Request"}
            </button>
            <a href="/" className="btn-secondary text-center">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
