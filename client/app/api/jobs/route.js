import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function proxyToBackend(path, options = {}) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    cache: "no-store",
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      {
        success: false,
        message: "Backend returned a non-JSON response. Check BACKEND_API_URL.",
        details: typeof payload === "string" ? payload.slice(0, 200) : payload,
      },
      { status: 502 }
    );
  }

  return NextResponse.json(payload, { status: response.status });
}

export async function GET(request) {
  const url = new URL(request.url);
  return proxyToBackend(`/api/jobs${url.search}`);
}

export async function POST(request) {
  const body = await request.text();
  return proxyToBackend("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}