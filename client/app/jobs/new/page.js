"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "../../../lib/api";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "Cleaning", "Gardening", "Other"];

function Field({ label, name, value, onChange, type = "text", placeholder, required, rows, error }) {
  const classes = `input ${error ? "border-rose-500 focus:ring-rose-500" : ""}`;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>
      {rows ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`${classes} min-h-[140px] resize-y`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={classes}
        />
      )}
      {error && <p className="mt-1.5 text-xs text-rose-300">{error}</p>}
    </div>
  );
}

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

  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(248,250,252,0.95),_rgba(255,255,255,1))]" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="mb-8">
          <a href="/" className="inline-flex items-center text-sm text-slate-500 transition-colors hover:text-blue-600">
            Back to listings
          </a>
          <div className="mt-5 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Request form
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Post a Service Request
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Describe the job clearly so the right tradespeople can quote and respond quickly.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Leaking kitchen tap needs urgent repair"
            required
            error={errors.title}
          />

          <Field
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the job in detail — location in the house, urgency, any specific requirements..."
            required
            rows={4}
            error={errors.description}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category <span className="text-blue-600">*</span>
              </label>
              <select name="category" value={form.category} onChange={handleChange} className="input">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Glasgow"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="mb-4 text-sm font-medium text-slate-700">
              Contact information <span className="text-slate-500">(optional)</span>
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Your Name"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="John Smith"
              />
              <Field
                label="Email Address"
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="john@example.com"
                error={errors.contactEmail}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="submit" className="btn-primary min-w-[160px]" disabled={loading}>
              {loading ? "Posting..." : "Post Request"}
            </button>
            <a href="/" className="btn-secondary text-center sm:min-w-[140px]">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
