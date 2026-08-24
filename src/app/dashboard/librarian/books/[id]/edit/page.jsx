"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Save } from "lucide-react";

export default function EditBookPage() {
  const [formData, setFormData] = useState({
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    isbn: "9780743273565",
    description:
      "A classic American novel about wealth, love, and the American Dream.",
    publisher: "Scribner",
    publicationYear: "1925",
    copies: "12",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    // TODO:
    // Connect this form with Bookora backend API.

    setTimeout(() => {
      setSaving(false);
      alert("Book updated successfully.");
    }, 700);
  };

  return (
    <main className="min-h-screen bg-base-200 p-4 md:p-8">

      <div className="mx-auto max-w-4xl">

        <Link
          href="/librarian/books"
          className="btn btn-ghost mb-5"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </Link>

        <div className="card border border-base-300 bg-base-100 shadow-sm">

          <div className="card-body">

            <div className="mb-6">

              <div className="mb-2 flex items-center gap-2 text-primary">
                <BookOpen size={22} />

                <span className="font-medium">
                  Bookora
                </span>
              </div>

              <h1 className="text-2xl font-bold">
                Edit Book
              </h1>

              <p className="text-base-content/60">
                Update the information of this book.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <FormInput
                  label="Book Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />

                <div className="form-control">

                  <label className="label">
                    <span className="label-text">
                      Category
                    </span>
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="Classic">
                      Classic
                    </option>

                    <option value="Programming">
                      Programming
                    </option>

                    <option value="Self Development">
                      Self Development
                    </option>

                    <option value="Finance">
                      Finance
                    </option>

                    <option value="Science">
                      Science
                    </option>

                    <option value="History">
                      History
                    </option>
                  </select>

                </div>

                <FormInput
                  label="ISBN"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                />

                <FormInput
                  label="Publication Year"
                  name="publicationYear"
                  type="number"
                  value={formData.publicationYear}
                  onChange={handleChange}
                />

                <FormInput
                  label="Total Copies"
                  name="copies"
                  type="number"
                  min="1"
                  value={formData.copies}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-control">

                <label className="label">
                  <span className="label-text">
                    Description
                  </span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered min-h-36"
                  placeholder="Write a short description..."
                />

              </div>

              <div className="flex justify-end gap-3 border-t border-base-300 pt-5">

                <Link
                  href="/librarian/books"
                  className="btn btn-ghost"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </main>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  min,
}) {
  return (
    <div className="form-control">

      <label className="label">
        <span className="label-text">
          {label}
        </span>
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        required={required}
        className="input input-bordered w-full"
      />

    </div>
  );
}