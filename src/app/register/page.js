"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    try {
      setLoading(true);

      const { data, error } =
        await authClient.signUp.email({
          name: form.name,
          email: form.email,
          password: form.password,
          image:
            form.image || undefined,
        });

      if (error) {
        setError(
          error.message ||
            "Registration failed."
        );

        return;
      }

      if (data?.user) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          {
            method: "POST",
            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
  name: data.user.name,
  email: data.user.email,
  image: data.user.image || "",
  role: form.role,
}),
          }
        );
      }

      router.push("/");
      router.refresh();
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
      <div className="mx-auto max-w-lg">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="mb-4 text-center">
              <h1 className="text-3xl font-bold">
                Create your Bookora account
              </h1>

              <p className="mt-2 text-base-content/60">
                Join Bookora and discover
                books around you.
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
                    Full Name
                  </span>
                </label>

                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className="input input-bordered w-full"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    Email
                  </span>
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    Photo URL
                  </span>
                </label>

                <input
                  name="image"
                  type="url"
                  placeholder="https://..."
                  className="input input-bordered w-full"
                  value={form.image}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    Password
                  </span>
                </label>

                <input
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="input input-bordered w-full"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    Confirm Password
                  </span>
                </label>

                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  className="input input-bordered w-full"
                  value={
                    form.confirmPassword
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    Account Type
                  </span>
                </label>

                <select
                  name="role"
                  className="select select-bordered w-full"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="user">
                    User / Reader
                  </option>

                  <option value="librarian">
                    Librarian
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
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
              Already have an account?{" "}
              <Link
                href="/login"
                className="link link-primary font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}