
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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) throw error;

      router.push("/auth/sign-up-success");
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
          <CardTitle className="auth-title">
            Create your account
          </CardTitle>

          <CardDescription className="auth-description">
            Join CurrencyHub and manage your currencies in one place.
          </CardDescription>
        </CardHeader>

        <CardContent className="auth-card-content">
          <form onSubmit={handleSignUp} className="auth-form">
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

              <div className="auth-field">
                <Label htmlFor="password" className="auth-label">
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <Label htmlFor="repeat-password" className="auth-label">
                  Confirm password
                </Label>

                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="Enter your password again"
                  required
                  className="auth-input"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
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
              {isLoading ? "Creating your account..." : "Create account"}
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
    </div>
  );
}
