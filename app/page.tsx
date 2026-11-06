
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Check the user's authentication session.
async function HomeRedirect(): Promise<never> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  // If the user is not authenticated, redirect to login.
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // If authenticated, redirect to the dashboard.
  redirect("/protected");
}

// Suspense handles the request-time authentication check.
export default function Home() {
  return (
    <Suspense fallback={<main>Checking your session...</main>}>
      <HomeRedirect />
    </Suspense>
  );
}
