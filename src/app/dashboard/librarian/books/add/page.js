"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

export default function AddBookPage() {
  const [form, setForm] =
    useState({
      title: "",
      author: "",
      description: "",
      category: "",
      deliveryFee: "",
    });

  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData =
        new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "author",
        form.author
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "deliveryFee",
        form.deliveryFee
      );

      if (image) {
        formData.append(
          "coverImage",
          image
        );
      }

      const result =
        await apiFetch(
          "/books",
          {
            method: "POST",
            body: formData,
          }
        );

      setMessage(
        result.message
      );

      setForm({
        title: "",
        author: "",
        description: "",
        category: "",
        deliveryFee: "",
      });

      setImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      <Link
        href="/dashboard/librarian"
        className="btn btn-ghost mb-6 rounded-xl"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Librarian
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Add a New Book
        </h1>

        <p className="mt-3 text-base-content/55">
          Submit your book for admin approval.
        </p>
      </div>

      {message && (
        <div className="alert alert-success mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <fieldset className="fieldset">
            <label className="fieldset-label">
              Book Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="input input-bordered w-full rounded-xl"
              placeholder="Atomic Habits"
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="fieldset-label">
              Author
            </label>

            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              required
              className="input input-bordered w-full rounded-xl"
              placeholder="James Clear"
            />
          </fieldset>
        </div>

        <fieldset className="fieldset">
          <label className="fieldset-label">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={6}
            className="textarea textarea-bordered w-full rounded-xl"
            placeholder="Write a short description..."
          />
        </fieldset>

        <div className="grid gap-5 md:grid-cols-2">
          <fieldset className="fieldset">
            <label className="fieldset-label">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="select select-bordered w-full rounded-xl"
            >
              <option value="">
                Select category
              </option>

              <option>
                Fiction
              </option>

              <option>
                Sci-Fi
              </option>

              <option>
                Academic
              </option>

              <option>
                Programming
              </option>

              <option>
                Self Development
              </option>

              <option>
                Biography
              </option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <label className="fieldset-label">
              Delivery Fee
            </label>

            <input
              name="deliveryFee"
              value={form.deliveryFee}
              onChange={handleChange}
              required
              min="0"
              type="number"
              className="input input-bordered w-full rounded-xl"
              placeholder="100"
            />
          </fieldset>
        </div>

        <fieldset className="fieldset">
          <label className="fieldset-label">
            Book Cover
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-base-300 bg-base-200/50 px-6 py-12 text-center transition hover:border-primary">
            <ImagePlus
              size={34}
              className="text-primary"
            />

            <span className="mt-3 font-bold">
              {image
                ? image.name
                : "Choose book cover"}
            </span>

            <span className="mt-1 text-xs text-base-content/50">
              JPG, PNG or WEBP — max 5MB
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setImage(
                  e.target.files?.[0] ||
                    null
                )
              }
            />
          </label>
        </fieldset>

        <div className="rounded-2xl bg-warning/10 p-4 text-sm text-warning-content">
          <strong>
            Approval required:
          </strong>{" "}
          After submission, your book will be
          marked as Pending Approval. It will
          not appear publicly until an admin
          approves it.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg w-full rounded-xl"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Submitting...
            </>
          ) : (
            "Submit Book for Approval"
          )}
        </button>
      </form>
    </div>
  );
}