"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (username === "hacker" && password === "htn2026") {
        localStorage.setItem("isAuthenticated", "true");
        router.push("/");
      } else {
        setError("Invalid username or password");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-8 sm:px-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Welcome Back
          </h2>
        </div>

        <Card className="bg-card border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-foreground"
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="bg-background border-dark-blue/50 text-foreground placeholder:text-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-dark-blue"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="bg-background border-dark-blue/50 text-foreground placeholder:text-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-dark-blue"
                />
              </div>

              {error && (
                <div className="text-pink text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink hover:bg-pink/80 text-background font-semibold"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-sm text-light-blue hover:text-yellow transition-colors"
                >
                  ← Back to Events
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
