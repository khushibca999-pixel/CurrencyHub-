
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import Link from "next/link";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <p className="auth-message auth-error">
      {params?.error || "An unspecified error occurred."}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-icon">C</div>
          <h1 className="auth-brand-name">CurrencyHub</h1>
          <p className="auth-brand-description">
            Your currencies. One simple place.
          </p>
        </div>

        <Card className="auth-card">
          <CardHeader className="auth-card-header">
            <div className="auth-info-icon">!</div>
            <CardTitle className="auth-title">
              Something went wrong
            </CardTitle>
          </CardHeader>

          <CardContent className="auth-info-content">
            <Suspense
              fallback={<p className="auth-info-text">Loading error details...</p>}
            >
              <ErrorContent searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>

        <p className="auth-switch">
          <Link href="/auth/login" className="auth-link">
            Return to login
          </Link>
        </p>

        <p className="auth-footer">
          Secure currency management powered by CurrencyHub
        </p>
      </div>
    </main>
  );
}
