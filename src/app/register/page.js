
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ------------------------------------------------------------
  // Handle Input Change
  // ------------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ------------------------------------------------------------
  // Handle Role Change
  // ------------------------------------------------------------

  const handleRoleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      role: e.target.value,
    }));

    setError("");
  };

  // ------------------------------------------------------------
  // Handle Registration
  // ------------------------------------------------------------

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Name validation
    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Email validation
    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    // Uppercase validation
    if (!/[A-Z]/.test(form.password)) {
      setError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    // Lowercase validation
    if (!/[a-z]/.test(form.password)) {
      setError(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------------------
      // Better Auth Signup
      // --------------------------------------------------------

      const result = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.image.trim() || "",
        role: form.role,
      });

      // --------------------------------------------------------
      // Better Auth Error
      // --------------------------------------------------------

      if (result.error) {
        const errorMessage =
          result.error.message || "Registration failed.";

        setError(errorMessage);
        toast.error(errorMessage);

        return;
      }

      // --------------------------------------------------------
      // Registration Successful
      // --------------------------------------------------------

      toast.success("Registration Successful!");

      setSuccess(true);

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: "",
        role: "user",
      });
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Something went wrong during registration. Please try again."
      );

      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Google Sign In
  // ------------------------------------------------------------

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);

      setError(
        "Google sign-in failed. Please try again."
      );

      toast.error("Google sign-in failed.");

      setGoogleLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Success Modal Continue
  // ------------------------------------------------------------

  const handleSuccessContinue = () => {
    setSuccess(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-10">

      {/* ========================================================
          Registration Card
      ========================================================= */}

      <div className="w-full max-w-lg">

        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 sm:p-8">

          {/* ====================================================
              Header
          ==================================================== */}

          <div className="text-center mb-7">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
              <span className="text-3xl">
                📚
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create your account and start using Bookora
            </p>

          </div>

          {/* ====================================================
              Error Message
          ==================================================== */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ====================================================
              Registration Form
          ==================================================== */}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* ==================================================
                Full Name
            ================================================== */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* ==================================================
                Email
            ================================================== */}

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
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* ==================================================
                Profile Image
            ================================================== */}

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Profile Image URL

                <span className="ml-1 text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="image"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* ==================================================
                Account Type / Role
            ================================================== */}

            <div>

              <label className="mb-3 block text-sm font-medium text-gray-700">
                Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* =================================================
                    User
                ================================================= */}

                <label
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    form.role === "user"
                      ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100"
                      : "border-gray-200 bg-gray-50 hover:border-orange-200"
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={form.role === "user"}
                    onChange={handleRoleChange}
                    disabled={loading}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        form.role === "user"
                          ? "bg-orange-200"
                          : "bg-gray-200"
                      }`}
                    >
                      👤
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        User
                      </p>

                      <p className="text-xs text-gray-500">
                        Regular account
                      </p>
                    </div>

                  </div>

                </label>

                {/* =================================================
                    Librarian
                ================================================= */}

                <label
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    form.role === "librarian"
                      ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100"
                      : "border-gray-200 bg-gray-50 hover:border-orange-200"
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="librarian"
                    checked={form.role === "librarian"}
                    onChange={handleRoleChange}
                    disabled={loading}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        form.role === "librarian"
                          ? "bg-orange-200"
                          : "bg-gray-200"
                      }`}
                    >
                      📚
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Librarian
                      </p>

                      <p className="text-xs text-gray-500">
                        Library account
                      </p>
                    </div>

                  </div>

                </label>

              </div>

            </div>

            {/* ==================================================
                Password
            ================================================== */}

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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500 hover:text-orange-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

              <p className="mt-2 text-xs text-gray-400">
                Minimum 6 characters, including uppercase
                and lowercase letters.
              </p>

            </div>

            {/* ==================================================
                Confirm Password
            ================================================== */}

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
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500 hover:text-orange-500"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>

            {/* ==================================================
                Register Button
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  Creating Account...

                </span>
              ) : (
                "Create Account"
              )}

            </button>

          </form>

          {/* ====================================================
              Divider
          ==================================================== */}

          <div className="my-6 flex items-center gap-3">

            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200" />

          </div>

          {/* ====================================================
              Google Signup
          ==================================================== */}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={
              googleLoading || loading
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {googleLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />

                Connecting...
              </>
            ) : (
              <>
                <FcGoogle className="text-xl" />

                Continue with Google
              </>
            )}

          </button>

          {/* ====================================================
              Login Link
          ==================================================== */}

          <p className="mt-6 text-center text-sm text-gray-500">

            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

      {/* ========================================================
          Success Modal
      ========================================================= */}

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">

            {/* Success Icon */}

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">

              <span className="text-4xl">
                ✓
              </span>

            </div>

            {/* Title */}

            <h2 className="text-2xl font-bold text-gray-900">
              Registration Successful!
            </h2>

            {/* Description */}

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your Bookora account has been created
              successfully. You can now login to your
              account.
            </p>

            {/* Continue */}

            <button
              type="button"
              onClick={handleSuccessContinue}
              className="mt-6 w-full rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Continue to Login
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
