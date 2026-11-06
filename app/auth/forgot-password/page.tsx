
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function Page() {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-icon">C</div>
          <h1 className="auth-brand-name">CurrencyHub</h1>
          <p className="auth-brand-description">
            Let&apos;s help you get back into your account.
          </p>
        </div>

        <ForgotPasswordForm />

        <p className="auth-footer">
          Secure currency management powered by CurrencyHub
        </p>
      </div>
    </main>
  );
}
