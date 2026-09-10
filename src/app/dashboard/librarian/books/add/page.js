"use client";

import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  X,
} from "lucide-react";

export default function AddBookPage() {
  const [form, setForm] = useState({
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
    const { name, value } =
      e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    const file =
      e.target.files?.[0] || null;

    setError("");

    if (!file) {
      setImage(null);
      return;
    }

    // ----------------------------------------
    // Validate image type
    // ----------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG or WEBP images are allowed."
      );

      e.target.value = "";
      setImage(null);

      return;
    }

    // ----------------------------------------
    // Validate image size
    // Maximum 5 MB
    // ----------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be less than 5MB."
      );

      e.target.value = "";
      setImage(null);

      return;
    }

    setImage(file);
  }

  function removeImage() {
    setImage(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // ----------------------------------------
      // Client-side validation
      // ----------------------------------------

      if (!form.title.trim()) {
        throw new Error(
          "Book title is required."
        );
      }

      if (!form.author.trim()) {
        throw new Error(
          "Author is required."
        );
      }

      if (!form.description.trim()) {
        throw new Error(
          "Description is required."
        );
      }

      if (!form.category.trim()) {
        throw new Error(
          "Category is required."
        );
      }

      if (
        form.deliveryFee === "" ||
        Number.isNaN(
          Number(form.deliveryFee)
        ) ||
        Number(form.deliveryFee) < 0
      ) {
        throw new Error(
          "Please enter a valid delivery fee."
        );
      }

      if (!image) {
        throw new Error(
          "Book cover image is required."
        );
      }

      // ----------------------------------------
      // Create FormData
      // ----------------------------------------

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "author",
        form.author.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "category",
        form.category.trim()
      );

      formData.append(
        "deliveryFee",
        String(
          Number(form.deliveryFee)
        )
      );

      formData.append(
        "coverImage",
        image
      );

      // ----------------------------------------
      // Send request
      // ----------------------------------------

      const result =
        await apiFetch("/books", {
          method: "POST",
          body: formData,
        });

      // ----------------------------------------
      // Success
      // ----------------------------------------

      setMessage(
        result.message ||
          "Book submitted successfully. Waiting for admin approval."
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
      console.error(
        "Add Book Error:",
        err
      );

      setError(
        err.message ||
          "Failed to submit book."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      {/* ----------------------------------------
          Back
      ---------------------------------------- */}

      <Link
        href="/dashboard/librarian"
        className="btn btn-ghost mb-6 rounded-xl"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </Link>

      {/* ----------------------------------------
          Header
      ---------------------------------------- */}

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

      {/* ----------------------------------------
          Success
      ---------------------------------------- */}

      {message && (
        <div className="alert alert-success mb-6">
          <span>{message}</span>
        </div>
      )}

      {/* ----------------------------------------
          Error
      ---------------------------------------- */}

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {/* ----------------------------------------
          Form
      ---------------------------------------- */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
      >
        {/* ----------------------------------------
            Title + Author
        ---------------------------------------- */}

        <div className="grid gap-5 md:grid-cols-2">
          <fieldset className="fieldset">
            <label
              htmlFor="title"
              className="fieldset-label"
            >
              Book Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              disabled={loading}
              className="input input-bordered w-full rounded-xl"
              placeholder="Atomic Habits"
            />
          </fieldset>

          <fieldset className="fieldset">
            <label
              htmlFor="author"
              className="fieldset-label"
            >
              Author
            </label>

            <input
              id="author"
              name="author"
              type="text"
              value={form.author}
              onChange={handleChange}
              required
              disabled={loading}
              className="input input-bordered w-full rounded-xl"
              placeholder="James Clear"
            />
          </fieldset>
        </div>

        {/* ----------------------------------------
            Description
        ---------------------------------------- */}

        <fieldset className="fieldset">
          <label
            htmlFor="description"
            className="fieldset-label"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            disabled={loading}
            rows={6}
            className="textarea textarea-bordered w-full rounded-xl"
            placeholder="Write a short description..."
          />
        </fieldset>

        {/* ----------------------------------------
            Category + Delivery Fee
        ---------------------------------------- */}

        <div className="grid gap-5 md:grid-cols-2">
          <fieldset className="fieldset">
            <label
              htmlFor="category"
              className="fieldset-label"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={loading}
              className="select select-bordered w-full rounded-xl"
            >
              <option value="">
                Select category
              </option>

              <option value="Fiction">
                Fiction
              </option>

              <option value="Sci-Fi">
                Sci-Fi
              </option>

              <option value="Academic">
                Academic
              </option>

              <option value="Programming">
                Programming
              </option>

              <option value="Self Development">
                Self Development
              </option>

              <option value="Biography">
                Biography
              </option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <label
              htmlFor="deliveryFee"
              className="fieldset-label"
            >
              Delivery Fee
            </label>

            <input
              id="deliveryFee"
              name="deliveryFee"
              value={form.deliveryFee}
              onChange={handleChange}
              required
              disabled={loading}
              min="0"
              step="0.01"
              type="number"
              className="input input-bordered w-full rounded-xl"
              placeholder="100"
            />
          </fieldset>
        </div>

        {/* ----------------------------------------
            Book Cover
        ---------------------------------------- */}

        <fieldset className="fieldset">
          <label className="fieldset-label">
            Book Cover
          </label>

          {!image ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-base-300 bg-base-200/50 px-6 py-12 text-center transition hover:border-primary">
              <ImagePlus
                size={34}
                className="text-primary"
              />

              <span className="mt-3 font-bold">
                Choose book cover
              </span>

              <span className="mt-1 text-xs text-base-content/50">
                JPG, PNG or WEBP — max 5MB
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={loading}
                onChange={
                  handleImageChange
                }
              />
            </label>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-200/50 p-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-base-300">
                  <ImagePlus
                    size={24}
                    className="text-primary"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {image.name}
                  </p>

                  <p className="text-xs text-base-content/50">
                    {(
                      image.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={removeImage}
                disabled={loading}
                className="btn btn-circle btn-ghost"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </fieldset>

        {/* ----------------------------------------
            Approval Notice
        ---------------------------------------- */}

        <div className="rounded-2xl bg-warning/10 p-4 text-sm">
          <strong>
            Approval required:
          </strong>{" "}
          After submission, your book will be
          marked as Pending Approval. It will
          not appear publicly until an admin
          approves it.
        </div>

        {/* ----------------------------------------
            Submit
        ---------------------------------------- */}

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