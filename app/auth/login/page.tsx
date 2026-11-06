
import { LoginForm } from "@/components/login-form";

export default function Page() {
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

        <LoginForm />

        <p className="auth-footer">
          Secure currency management powered by CurrencyHub
        </p>
      </div>
    </main>
  );
}
