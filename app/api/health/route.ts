import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Check that both environment variables exist.
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { connected: false, error: "Supabase environment variables are missing." },
      { status: 500 }
    );
  }

  try {
    // Contact Supabase Auth's health endpoint.
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          connected: false,
          error: `Supabase returned HTTP ${response.status}.`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      connected: true,
      message: "Supabase Auth endpoint responded successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        connected: false,
        error: "Could not reach Supabase. Check your internet connection and Project URL.",
      },
      { status: 502 }
    );
  }
}