"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getAllBooks,
  approveBook,
  rejectBook,
  publishBook,
  unpublishBook,
  deleteBook,
} from "@/lib/api";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = async () => {
    try {
      setLoading(true);

      const data = await getAllBooks();

      setBooks(data.books || []);
    } catch (error) {
      setError(error.message);
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
        book.librarianEmail
          ?.toLowerCase()
          .includes(text);

      const matchesStatus =
        status === "all" ||
        book.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [books, search, status]);

  const handleAction = async (
    id,
    action
  ) => {
    try {
      if (action === "approve") {
        await approveBook(id);
      }

      if (action === "reject") {
        await rejectBook(id);
      }

      if (action === "publish") {
        await publishBook(id);
      }

      if (action === "unpublish") {
        await unpublishBook(id);
      }

      if (action === "delete") {
        const confirmed = window.confirm(
          "Delete this book permanently?"
        );

        if (!confirmed) return;

        await deleteBook(id);
      }

      await loadBooks();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="alert alert-error">
          {error}

          <button
            className="btn btn-sm"
            onClick={loadBooks}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 p-4 md:p-8">

      <div className="mx-auto max-w-7xl space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            All Books
          </h1>

          <p className="text-base-content/60">
            Manage all Bookora books.
          </p>
        </div>

        {/* Filters */}

        <div className="card bg-base-100 shadow-sm">

          <div className="flex flex-col gap-3 p-4 md:flex-row">

            <input
              className="input input-bordered flex-1"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

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

              <option value="pending">
                Pending
              </option>

              <option value="published">
                Published
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
                  <th>Librarian</th>
                  <th>Status</th>
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
                      {book.librarianEmail}
                    </td>

                    <td>
                      <StatusBadge
                        status={book.status}
                      />
                    </td>

                    <td>

                      <div className="flex flex-wrap gap-1">

                        {book.status ===
                          "pending" && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleAction(
                                  book._id,
                                  "approve"
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-error btn-outline btn-sm"
                              onClick={() =>
                                handleAction(
                                  book._id,
                                  "reject"
                                )
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {book.status ===
                          "published" && (
                          <button
                            className="btn btn-warning btn-outline btn-sm"
                            onClick={() =>
                              handleAction(
                                book._id,
                                "unpublish"
                              )
                            }
                          >
                            Unpublish
                          </button>
                        )}

                        {book.status ===
                          "unpublished" && (
                          <button
                            className="btn btn-success btn-outline btn-sm"
                            onClick={() =>
                              handleAction(
                                book._id,
                                "publish"
                              )
                            }
                          >
                            Publish
                          </button>
                        )}

                        <button
                          className="btn btn-error btn-outline btn-sm"
                          onClick={() =>
                            handleAction(
                              book._id,
                              "delete"
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: ["Pending", "badge-warning"],
    published: ["Published", "badge-success"],
    unpublished: [
      "Unpublished",
      "badge-neutral",
    ],
    rejected: ["Rejected", "badge-error"],
  };

  const [label, style] =
    config[status] || [
      status,
      "badge-neutral",
    ];

  return (
    <span className={`badge ${style}`}>
      {label}
    </span>
  );
}