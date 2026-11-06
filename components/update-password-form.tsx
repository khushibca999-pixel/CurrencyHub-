
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
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleForgotPassword = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      router.push("/protected");
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
      <Card className="auth-card">
        <CardHeader className="auth-card-header">
          <div className="auth-info-icon">🔒</div>

          <CardTitle className="auth-title">
            Create a New Password
          </CardTitle>

          <CardDescription className="auth-description">
            Choose a strong password for your CurrencyHub account.
          </CardDescription>
        </CardHeader>

        <CardContent className="auth-card-content">
          <form
            onSubmit={handleForgotPassword}
            className="auth-form"
          >
            <div className="auth-fields">
              <div className="auth-field">
                <Label htmlFor="password" className="auth-label">
                  New password
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Updating password..." : "Update password"}
            </Button>

            <div className="auth-switch">
              Remembered your password?{" "}
              <Link href="/auth/login" className="auth-link">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
