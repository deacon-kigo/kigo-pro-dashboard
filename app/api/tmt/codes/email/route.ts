import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decryptCode, COOKIE_NAME } from "@/lib/tmt/code-encryption";
import { successResponse, ApiErrors } from "@/lib/tmt/api-response";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { affiliate_slug, email } = body;

    if (!affiliate_slug || !email) {
      return ApiErrors.missingFields(["affiliate_slug", "email"]);
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

    const response = await fetch(`${KIGO_BASE_URL}/public/tmt-codes/email`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: decrypted.code,
        affiliate_slug: decrypted.affiliateSlug,
        email,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return ApiErrors.upstreamError(
        error.message || "Failed to update email",
        response.status
      );
    }

    const data = await response.json();
    return successResponse(data, "Email updated successfully");
  } catch (error) {
    return ApiErrors.internalError("Failed to update email");
  }
}
