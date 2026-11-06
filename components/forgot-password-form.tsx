
"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("auth-form-shell", className)}
      {...props}
    >
      {success ? (
        /* Success state after Supabase accepts the reset request */
        <Card className="auth-card">
          <CardHeader className="auth-card-header">
            <div className="auth-info-icon">✉</div>

            <CardTitle className="auth-title">
              Check Your Email
            </CardTitle>

            <CardDescription className="auth-description">
              Password reset instructions sent.
            </CardDescription>
          </CardHeader>

          <CardContent className="auth-info-content">
            <p className="auth-info-text">
              If you registered using your email and password,
              you will receive a password reset email.
            </p>

            <div className="auth-switch">
              <Link href="/auth/login" className="auth-link">
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Password reset request form */
        <Card className="auth-card">
          <CardHeader className="auth-card-header">
            <CardTitle className="auth-title">
              Reset Your Password
            </CardTitle>

            <CardDescription className="auth-description">
              Enter your registered email address. We&apos;ll
              send you a secure link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="auth-card-content">
            <form
              onSubmit={handleForgotPassword}
              className="auth-form"
            >
              <div className="auth-fields">
                <div className="auth-field">
                  <Label htmlFor="email" className="auth-label">
                    Email address
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="auth-message auth-error">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset email"}
              </Button>

              <div className="auth-switch">
                Already have an account?{" "}
                <Link href="/auth/login" className="auth-link">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
