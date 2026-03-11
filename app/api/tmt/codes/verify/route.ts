import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { encryptCode, COOKIE_NAME } from "@/lib/tmt/code-encryption";
import { successResponse, ApiErrors } from "@/lib/tmt/api-response";

const isDev = process.env.PUBLIC_ENV === "DEVELOPMENT";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, affiliate_slug } = body;

    if (!code || !affiliate_slug) {
      return ApiErrors.missingFields(["code", "affiliate_slug"]);
    }

    const encrypted = encryptCode(code, affiliate_slug);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, encrypted, {
      httpOnly: !isDev,
      secure: !isDev,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 1 week
      path: "/",
    });

    return successResponse({ verified: true }, "Code verified successfully");
  } catch (error) {
    return ApiErrors.internalError("Failed to verify code");
  }
}
