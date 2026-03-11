import { NextRequest, NextResponse } from "next/server";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

export async function POST(request: NextRequest) {
  if (!KIGO_BASE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_KIGO_CORE_SERVER_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log(
      `[TMT Auth] Login request to ${KIGO_BASE_URL}/dashboard/auth/log-in`
    );

    const res = await fetch(`${KIGO_BASE_URL}/dashboard/auth/log-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to reach auth server" },
      { status: 502 }
    );
  }
}
