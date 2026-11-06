import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // Read the authorization code from Supabase's email redirect
  const code = searchParams.get("code");

  // Check whether the code exists
  if (!code) {
    const errorUrl = new URL("/auth/error", origin);

    errorUrl.searchParams.set(
      "error",
      "Missing authorization code. Please request a new confirmation email."
    );

    return NextResponse.redirect(errorUrl);
  }

  // Create the Supabase server client
  const supabase = await createClient();

  // Exchange the authorization code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errorUrl = new URL("/auth/error", origin);
    errorUrl.searchParams.set("error", error.message);

    return NextResponse.redirect(errorUrl);
  }

  // Successful confirmation: go to the dashboard
  return NextResponse.redirect(new URL("/protected", origin));
}
