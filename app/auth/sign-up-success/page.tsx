
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-icon">C</div>
          <h1 className="auth-brand-name">CurrencyHub</h1>
          <p className="auth-brand-description">
            One simple place for your currencies.
          </p>
        </div>

        <Card className="auth-card">
          <CardHeader className="auth-card-header">
            <div className="auth-info-icon">✉</div>
            <CardTitle className="auth-title">
              Check your email!
            </CardTitle>
            <CardDescription className="auth-description">
              Your account is almost ready.
            </CardDescription>
          </CardHeader>

          <CardContent className="auth-info-content">
            <p className="auth-info-text">
              You&apos;ve successfully signed up. Please check your email
              and click the confirmation link to activate your account.
            </p>
          </CardContent>
        </Card>

        <p className="auth-footer">
          Secure currency management powered by CurrencyHub
        </p>
      </div>
    </main>
  );
}
