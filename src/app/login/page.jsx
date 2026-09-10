
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
      callbackURL: "http://localhost:3000/",
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-200 px-4 py-5 sm:px-6">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Brand / Header */}
        <div className="mb-5 text-center">

          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
              />
            </svg>

          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome Back
          </h1>

          <p className="mt-1.5 text-sm text-base-content/55">
            Login to your Bookora account.
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-base-300/60 bg-base-100 shadow-2xl shadow-base-content/5">

          <div className="p-6 sm:p-8">

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-error">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>

                <span className="text-sm font-medium leading-5">
                  {error}
                </span>

              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/35">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.11 1.944l-7.5 4.375a2.25 2.25 0 01-2.28 0l-7.5-4.375A2.25 2.25 0 012.25 6.993V6.75"
                      />
                    </svg>
                  </div>

                  <input
                    type="email"
                    className="input input-bordered h-12 w-full rounded-xl bg-base-200/40 pl-11 pr-4 transition-all placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/35">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0119.5 12.75v6A2.25 2.25 0 0117.25 21H6.75a2.25 2.25 0 01-2.25-2.25v-6a2.25 2.25 0 012.25-2.25z"
                      />
                    </svg>
                  </div>

                  <input
                    type="password"
                    className="input input-bordered h-12 w-full rounded-xl bg-base-200/40 pl-11 pr-4 transition-all placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-4 focus:ring-primary/10"
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
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn btn-primary h-12 min-h-12 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-base-300" />

              <span className="text-[11px] font-semibold tracking-wider text-base-content/40">
                OR
              </span>

              <div className="h-px flex-1 bg-base-300" />

            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline h-12 min-h-12 w-full rounded-xl border-base-300 bg-base-100 text-sm font-semibold transition-all hover:border-base-content/30 hover:bg-base-200"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.75Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.53 13.84A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.84V7.63H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.37l3.24-2.53Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.13c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.2 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.38l3.24 2.53C7.3 7.85 9.46 6.13 12 6.13Z"
                />
              </svg>

              Continue with Google

            </button>

            {/* Register */}
            <p className="mt-6 text-center text-sm text-base-content/60">
              Don't have an account?{" "}

              <Link
                href="/register"
                className="font-bold text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                Create Account
              </Link>

            </p>

          </div>
        </div>

        {/* Bottom text */}
        <p className="mt-4 text-center text-[11px] text-base-content/35">
          Welcome to Bookora — discover, read and share books.
        </p>

      </div>
    </main>
  );
}
