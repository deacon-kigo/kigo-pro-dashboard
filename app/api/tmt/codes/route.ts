import { NextRequest } from "next/server";
import { successResponse, ApiErrors } from "@/lib/tmt/api-response";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const affiliateSlug = searchParams.get("affiliate_slug");
  const code = searchParams.get("code");

  if (!affiliateSlug || !code) {
    return ApiErrors.missingFields(["affiliate_slug", "code"]);
  }

  try {
    const response = await fetch(
      `${KIGO_BASE_URL}/public/tmt-codes?affiliate_slug=${encodeURIComponent(affiliateSlug)}&code=${encodeURIComponent(code)}`,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return ApiErrors.notFound("Code");
      }
      const error = await response.json().catch(() => ({}));
      return ApiErrors.upstreamError(
        error.message || "Failed to fetch code info",
        response.status
      );
    }

    const data = await response.json();
    return successResponse(data, "Code info retrieved successfully");
  } catch (error) {
    return ApiErrors.internalError("Failed to fetch code info");
  }
}
