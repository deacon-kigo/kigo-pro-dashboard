import { NextRequest, NextResponse } from "next/server";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

async function proxyRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>
) {
  if (!KIGO_BASE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_KIGO_CORE_SERVER_URL is not configured" },
      { status: 500 }
    );
  }

  const { path } = await params;
  const targetPath = path.join("/");
  const targetUrl = `${KIGO_BASE_URL}/dashboard/${targetPath}`;

  console.log(`[TMT Proxy] ${request.method} ${targetUrl}`);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Forward auth header
  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    // Forward body for non-GET requests
    if (request.method !== "GET" && request.method !== "HEAD") {
      const contentType = request.headers.get("Content-Type") || "";
      if (contentType.includes("multipart/form-data")) {
        // For file uploads, forward as-is
        delete headers["Content-Type"];
        fetchOptions.body = await request.blob();
      } else {
        fetchOptions.body = await request.text();
      }
    }

    const res = await fetch(targetUrl, fetchOptions);

    // Handle CSV/binary responses
    const resContentType = res.headers.get("Content-Type") || "";
    if (
      resContentType.includes("text/csv") ||
      resContentType.includes("application/octet-stream")
    ) {
      const blob = await res.blob();
      return new NextResponse(blob, {
        status: res.status,
        headers: {
          "Content-Type": resContentType,
          "Content-Disposition": res.headers.get("Content-Disposition") || "",
        },
      });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error(`[TMT Proxy] Error: ${error.message}`, { targetUrl });
    return NextResponse.json(
      { message: error.message || "Failed to reach Kigo Core Server" },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
