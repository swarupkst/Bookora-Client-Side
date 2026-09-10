"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  getMyBooks,
  deleteBook,
  unpublishBook,
} from "@/lib/api";

export default function LibrarianBooksPage() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyBooks();

      setBooks(data.books || []);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load your books"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const text = search.toLowerCase();

      const matchesSearch =
        book.title?.toLowerCase().includes(text) ||
        book.author?.toLowerCase().includes(text) ||
        book.category?.toLowerCase().includes(text);

      const matchesStatus =
        status === "all" ||
        book.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [books, search, status]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      await deleteBook(id);

      setBooks((current) =>
        current.filter(
          (book) => book._id !== id
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUnpublish = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to unpublish this book?"
    );

    if (!confirmed) return;

    try {
      await unpublishBook(id);

      setBooks((current) =>
        current.map((book) =>
          book._id === id
            ? {
                ...book,
                status: "unpublished",
              }
            : book
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-base-200 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-base-200 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="alert alert-error">
            <span>{error}</span>

            <button
              className="btn btn-sm"
              onClick={loadBooks}
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  const totalBooks = books.length;

  const publishedBooks = books.filter(
    (book) => book.status === "published"
  ).length;

  const pendingBooks = books.filter(
    (book) => book.status === "pending"
  ).length;

  const unpublishedBooks = books.filter(
    (book) => book.status === "unpublished"
  ).length;

  return (
    <main className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <BookOpen size={24} />

              <span className="font-medium">
                Bookora Librarian
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Book Inventory
            </h1>

            <p className="text-base-content/60">
              Manage your books.
            </p>
          </div>

          <Link
            href="/librarian/books/add"
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add New Book
          </Link>

        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            title="Total Books"
            value={totalBooks}
            icon={<BookOpen size={22} />}
          />

          <Stat
            title="Published"
            value={publishedBooks}
            icon={<CheckCircle2 size={22} />}
          />

          <Stat
            title="Pending"
            value={pendingBooks}
            icon={<Clock3 size={22} />}
          />

          <Stat
            title="Unpublished"
            value={unpublishedBooks}
            icon={<XCircle size={22} />}
          />

        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-sm">

          <div className="flex flex-col gap-3 p-4 md:flex-row">

            <label className="input input-bordered flex flex-1 items-center gap-2">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="grow"
              />

            </label>

            <select
              className="select select-bordered"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="published">
                Published
              </option>

              <option value="pending">
                Pending Approval
              </option>

              <option value="unpublished">
                Unpublished
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

          </div>

        </div>

        {/* Table */}
        <div className="card overflow-hidden bg-base-100 shadow-sm">

          <div className="overflow-x-auto">

            <table className="table">

              <thead>
                <tr>
                  <th>Book</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Copies</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredBooks.map((book) => (

                  <tr key={book._id}>

                    <td>
                      <div className="font-semibold">
                        {book.title}
                      </div>

                      <div className="text-sm text-base-content/60">
                        {book.author}
                      </div>
                    </td>

                    <td>
                      {book.category}
                    </td>

                    <td>
                      <StatusBadge
                        status={book.status}
                      />
                    </td>

                    <td>
                      {book.copies}
                    </td>

                    <td>
                      {book.availableCopies}
                    </td>

                    <td>

                      <div className="flex gap-1">

                        <Link
                          href={`/books/${book._id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          href={`/librarian/books/${book._id}/edit`}
                          className="btn btn-ghost btn-sm"
                        >
                          <Pencil size={16} />
                        </Link>

                        {book.status ===
                          "published" && (
                          <button
                            className="btn btn-warning btn-outline btn-sm"
                            onClick={() =>
                              handleUnpublish(
                                book._id
                              )
                            }
                          >
                            Unpublish
                          </button>
                        )}

                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() =>
                            handleDelete(
                              book._id
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {!filteredBooks.length && (
            <div className="p-12 text-center">
              <BookOpen
                className="mx-auto opacity-30"
                size={40}
              />

              <h3 className="mt-3 font-semibold">
                No books found
              </h3>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">

        <div className="flex justify-between">

          <div>
            <p className="text-sm text-base-content/60">
              {title}
            </p>

            <p className="text-2xl font-bold">
              {value}
            </p>
          </div>

          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            {icon}
          </div>

        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    published: [
      "Published",
      "badge-success",
    ],
    pending: [
      "Pending Approval",
      "badge-warning",
    ],
    unpublished: [
      "Unpublished",
      "badge-neutral",
    ],
    rejected: [
      "Rejected",
      "badge-error",
    ],
  };

  const [label, className] =
    config[status] || [
      status,
      "badge-neutral",
    ];

  return (
    <span className={`badge ${className}`}>
      {label}
    </span>
  );
}