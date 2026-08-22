"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error } =
        await authClient.signIn.email({
          email,
          password,
        });

      if (error) {
        setError(
          error.message ||
            "Invalid email or password."
        );

        return;
      }

      if (data?.user) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");

    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="mb-4 text-center">
              <h1 className="text-3xl font-bold">
                Welcome Back
              </h1>

              <p className="mt-2 text-base-content/60">
                Login to your Bookora account.
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="label">
                  <span className="label-text">
                    Email
                  </span>
                </label>

                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    Password
                  </span>
                </label>

                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>
            </form>

            <div className="divider">
              OR
            </div>

            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline w-full"
            >
              Continue with Google
            </button>

            <p className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="link link-primary font-semibold"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}