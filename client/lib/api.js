async function request(path, options = {}) {
  const res = await fetch(path, {
    cache: "no-store",
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message = isJson && body?.message
      ? body.message
      : typeof body === "string" && body.trim()
        ? body
        : "Request failed";

    throw new Error(message);
  }

  if (!isJson) {
    throw new Error("Expected JSON response from the API");
  }

  return body;
}

export async function fetchJobs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.status) params.append("status", filters.status);
  if (filters.search) params.append("search", filters.search);

  const queryString = params.toString();
  return request(`/api/jobs${queryString ? `?${queryString}` : ""}`);
}

export async function fetchJob(id) {
  return request(`/api/jobs/${id}`);
}

export async function createJob(data) {
  return request(`/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateJobStatus(id, status) {
  return request(`/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function deleteJob(id) {
  return request(`/api/jobs/${id}`, { method: "DELETE" });
}
