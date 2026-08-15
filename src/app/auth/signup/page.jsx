"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoMode, setPhotoMode] = useState("url");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const fullName = formData.get("fullName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const photoUrl = formData.get("photoUrl")?.toString().trim();

    // Validate role
    if (!role) {
      setError("Please select a role.");
      return;
    }

    // Validate full name
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    // Validate email
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // Validate password
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate photo URL if URL mode is selected
    if (photoMode === "url" && photoUrl) {
      try {
        new URL(photoUrl);
      } catch {
        setError("Please enter a valid profile photo URL.");
        return;
      }
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: fullName,
        email,
        password,

        // Your Better Auth additional field
        role,

        // Better Auth uses "image" for the user's profile image.
        ...(photoMode === "url" && photoUrl
          ? {
              image: photoUrl,
            }
          : {}),
      });

      if (error) {
        setError(
          error.message || "Registration failed. Please try again."
        );
        return;
      }

      setSuccess("Account created successfully!");

      // Redirect after successful registration
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        "Something went wrong while creating your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setSuccess("");

    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("Google sign-up error:", err);

      setError(
        "Unable to continue with Google. Please try again."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-4 py-8 sm:px-6 lg:flex lg:items-center lg:justify-center lg:px-8">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join Bookora and start your reading journey.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">

          <form onSubmit={handleSubmit} className="space-y-5">

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

            {/* Full Name + Email */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C58B45] focus:ring-2 focus:ring-[#C58B45]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

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
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C58B45] focus:ring-2 focus:ring-[#C58B45]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    minLength={8}
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C58B45] focus:ring-2 focus:ring-[#C58B45]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-medium text-gray-500 transition hover:text-[#C58B45] disabled:cursor-not-allowed"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Profile Photo
                </label>

                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setPhotoMode("url")}
                    disabled={loading}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      photoMode === "url"
                        ? "bg-white text-[#C58B45] shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Photo URL
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoMode("upload")}
                    disabled={loading}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      photoMode === "upload"
                        ? "bg-white text-[#C58B45] shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {photoMode === "url" ? (
                <input
                  name="photoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C58B45] focus:ring-2 focus:ring-[#C58B45]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-4 transition hover:border-[#C58B45] hover:bg-[#C58B45]/5">
                  <span className="text-xl">📷</span>

                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Click to upload a photo
                    </p>

                    <p className="text-xs text-gray-400">
                      PNG, JPG or JPEG
                    </p>
                  </div>

                  <input
                    type="file"
                    name="photo"
                    accept="image/png,image/jpeg,image/jpg"
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              )}

              {photoMode === "upload" && (
                <p className="mt-2 text-xs text-gray-400">
                  Image upload requires a storage service such as
                  Cloudinary, S3, or Cloudflare R2. The selected file
                  is not uploaded directly to Better Auth.
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Choose your role
              </label>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Reader */}
                <button
                  type="button"
                  onClick={() => setRole("reader")}
                  disabled={loading}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === "reader"
                      ? "border-[#C58B45] bg-[#C58B45]/5 ring-2 ring-[#C58B45]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">📚</span>

                    {role === "reader" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C58B45] text-xs text-white">
                        ✓
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Reader
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Browse and read books
                  </p>
                </button>

                {/* Librarian */}
                <button
                  type="button"
                  onClick={() => setRole("librarian")}
                  disabled={loading}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === "librarian"
                      ? "border-[#C58B45] bg-[#C58B45]/5 ring-2 ring-[#C58B45]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">📖</span>

                    {role === "librarian" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C58B45] text-xs text-white">
                        ✓
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Librarian
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Manage library resources
                  </p>
                </button>
              </div>

              <input
                type="hidden"
                name="role"
                value={role}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                disabled={loading}
                className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#C58B45]"
              />

              <label
                htmlFor="terms"
                className="cursor-pointer text-xs leading-5 text-gray-500"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-[#C58B45] hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-[#C58B45] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={!role || loading}
              className="flex w-full items-center justify-center rounded-lg bg-[#C58B45] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#AD7435] focus:outline-none focus:ring-2 focus:ring-[#C58B45]/30 disabled:cursor-not-allowed disabled:opacity-50"
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

                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-100" />

            <span className="text-xs text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                    d="M12 6.36c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.45 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.25 2.51 1.53 1.18C7.31 8.08 9.46 6.36 12 6.36Z"
                    fill="#EA4335"
                  />
                </svg>

                Continue with Google
              </>
            )}
          </button>

          {/* Login */}
          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#C58B45] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}