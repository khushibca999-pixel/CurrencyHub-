import { redirect } from "next/navigation";
import { Suspense } from "react";


import { createClient } from "@/lib/supabase/server";
import CurrencyHubDashboard from "@/components/currencyhub-dashboard";
export const instant = false;

async function ProtectedDashboard() {
  // Create Supabase server client.
  const supabase = await createClient();

  // Verify the authenticated user's session.
  const { data, error } = await supabase.auth.getClaims();

  // Redirect visitors who are not authenticated.
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Safely retrieve the user's email from the verified claims.
  const userEmail =
    typeof data.claims.email === "string"
      ? data.claims.email
      : "Your account";

  // Pass the email to our interactive dashboard.
  return <CurrencyHubDashboard userEmail={userEmail} />;
}

export default function ProtectedPage() {
  return (
    <Suspense fallback={<main>Checking your session...</main>}>
      <ProtectedDashboard />
    </Suspense>
  );
}