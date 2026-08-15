"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email,
        password,

        // Better Auth session configuration
        rememberMe,
      });

      if (error) {
        console.error("Sign in error:", error);

        setError(
          error.message || "Invalid email or password."
        );

        return;
      }

      console.log("Sign in successful:", data);

      setSuccess("Signed in successfully!");

      // Give the success message a moment before redirecting
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      console.error("Sign in exception:", err);

      setError(
        "Something went wrong while signing in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("Google sign in error:", err);

      setError(
        "Unable to continue with Google. Please try again."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo & Heading */}
        <div className="mb-8 text-center">

          <h1 className="mt-7 text-2xl font-semibold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue your reading journey.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600"
              >
                {success}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C58B45] focus:ring-2 focus:ring-[#C58B45]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#C58B45] hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C58B45] focus:ring-2 focus:ring-[#C58B45]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-medium text-gray-500 transition hover:text-[#C58B45] disabled:cursor-not-allowed"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">

              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                disabled={loading}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#C58B45]"
              />

              <label
                htmlFor="remember"
                className="cursor-pointer text-sm text-gray-500"
              >
                Remember me
              </label>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#C58B45] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#AD7435] focus:outline-none focus:ring-2 focus:ring-[#C58B45]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>

                  Signing In...
                </>
              ) : (
                "Sign In"
              )}

            </button>

          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">

            <div className="h-px flex-1 bg-gray-100" />

            <span className="text-xs text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-100" />

          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {googleLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>

                Connecting...
              </>
            ) : (
              <>
                {/* Google Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.39Z"
                    fill="#4285F4"
                  />

                  <path
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.51A9.74 9.74 0 0 0 12 21.5Z"
                    fill="#34A853"
                  />

                  <path
                    d="M6.54 13.61A5.86 5.86 0 0 1 6.23 12c0-.56.1-1.1.31-1.61V7.88H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.12l3.25-2.51Z"
                    fill="#FBBC05"
                  />

                  <path
                    d="M12 6.36c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.45 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.25 2.51C7.31 8.08 9.46 6.36 12 6.36Z"
                    fill="#EA4335"
                  />
                </svg>

                Continue with Google
              </>
            )}

          </button>

          {/* Signup */}
          <div className="mt-6 border-t border-gray-100 pt-6 text-center">

            <p className="text-sm text-gray-500">
              Don't have an account?{" "}

              <Link
                href="/auth/signup"
                className="font-semibold text-[#C58B45] hover:underline"
              >
                Create an account
              </Link>
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}