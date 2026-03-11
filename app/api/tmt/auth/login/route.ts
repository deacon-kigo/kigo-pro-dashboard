import { NextRequest, NextResponse } from "next/server";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
