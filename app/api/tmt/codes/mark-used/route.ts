import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decryptCode, COOKIE_NAME } from "@/lib/tmt/code-encryption";
import { successResponse, ApiErrors } from "@/lib/tmt/api-response";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { affiliate_slug } = body;

    if (!affiliate_slug) {
      return ApiErrors.missingField("affiliate_slug");
    }

    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(COOKIE_NAME)?.value;

    if (!cookieValue) {
      return ApiErrors.invalidVerification();
    }

    const decrypted = decryptCode(cookieValue);
    if (!decrypted) {
      return ApiErrors.invalidVerification();
    }

    if (decrypted.affiliateSlug !== affiliate_slug) {
      return ApiErrors.verificationMismatch();
    }

    const response = await fetch(
      `${KIGO_BASE_URL}/public/tmt-codes/mark-used`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: decrypted.code,
          affiliate_slug: decrypted.affiliateSlug,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return ApiErrors.upstreamError(
        error.message || "Failed to mark code as used",
        response.status
      );
    }

    const data = await response.json();
    return successResponse(data, "Code marked as used");
  } catch (error) {
    return ApiErrors.internalError("Failed to mark code as used");
  }
}
