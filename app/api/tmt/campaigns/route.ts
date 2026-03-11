import { NextRequest } from "next/server";
import { successResponse, ApiErrors } from "@/lib/tmt/api-response";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const affiliateSlug = searchParams.get("affiliate_slug");

  if (!affiliateSlug) {
    return ApiErrors.missingField("affiliate_slug");
  }

  try {
    const response = await fetch(
      `${KIGO_BASE_URL}/public/tmt-campaigns?affiliate_slug=${encodeURIComponent(affiliateSlug)}`,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return ApiErrors.notFound("Campaign");
      }
      const error = await response.json().catch(() => ({}));
      return ApiErrors.upstreamError(
        error.message || "Failed to fetch campaign",
        response.status
      );
    }

    const data = await response.json();
    return successResponse(data, "Campaign retrieved successfully");
  } catch (error) {
    return ApiErrors.internalError("Failed to fetch campaign");
  }
}
