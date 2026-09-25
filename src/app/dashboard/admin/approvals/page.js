"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Check,
  Search,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BOOKS_PER_PAGE = 10;

export default function ApprovalsPage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // Fetch pending books
  // =========================
  useEffect(() => {
    fetchPendingBooks();
  }, []);

  async function fetchPendingBooks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/books?status=pending`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch pending books"
        );
      }

      setBooks(result.data || []);
    } catch (error) {
      console.error(
        "Fetch pending books error:",
        error
      );

      setError(
        error.message ||
          "Failed to load pending books."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // Approve book
  // =========================
  async function approve(id) {
    const confirmed = confirm(
      "Are you sure you want to approve this book?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/books/${id}/approve`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to approve book"
        );
      }

      // Remove approved book from pending list
      setBooks((prev) =>
        prev.filter((book) => book._id !== id)
      );

      alert(
        "Book approved and published successfully."
      );
    } catch (error) {
      console.error(
        "Approve book error:",
        error
      );

      alert(
        error.message ||
          "Failed to approve the book."
      );
    } finally {
      setActionLoading(null);
    }
  }

  // =========================
  // Delete pending book
  // =========================
  async function remove(id) {
    const confirmed = confirm(
      "Are you sure you want to permanently delete this pending book?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/books/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete book"
        );
      }

      // Remove deleted book from UI
      setBooks((prev) =>
        prev.filter((book) => book._id !== id)
      );

      alert(
        "Pending book deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete book error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete the book."
      );
    } finally {
      setActionLoading(null);
    }
  }

  // =========================
  // Search filtering
  // =========================
  const filtered = books.filter((book) => {
    const librarian =
      book.librarianName ||
      book.librarian ||
      book.librarianId ||
      "";

    return `${book.title || ""} ${
      book.author || ""
    } ${librarian} ${book.category || ""}`
      .toLowerCase()
      .includes(query.toLowerCase());
  });

  // =========================
  // Reset page when searching
  // =========================
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // =========================
  // Pagination
  // =========================
  const totalPages = Math.ceil(
    filtered.length / BOOKS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * BOOKS_PER_PAGE;

  const endIndex =
    startIndex + BOOKS_PER_PAGE;

  const currentBooks = filtered.slice(
    startIndex,
    endIndex
  );

  // Keep page valid after delete
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // =========================
  // Page navigation
  // =========================
  function goToPage(page) {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  }

  return (
    <AdminShell
      title="Book Approval Queue"
      subtitle="Approve or remove books submitted by librarians."
    >
      {/* =========================
          Search
      ========================= */}
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
        <Search
          size={18}
          className="text-zinc-400"
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search pending books..."
          className="w-full outline-none"
        />
      </div>

      {/* =========================
          Error
      ========================= */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =========================
          Table
      ========================= */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3">
                  Book
                </th>

                <th className="px-5 py-3">
                  Librarian
                </th>

                <th className="px-5 py-3">
                  Category
                </th>

                <th className="px-5 py-3">
                  Fee
                </th>

                <th className="px-5 py-3">
                  Status
                </th>

                <th className="px-5 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {/* =========================
                  Loading
              ========================= */}
              {loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-zinc-500">
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      Loading pending books...
                    </div>
                  </td>
                </tr>
              )}

              {/* =========================
                  Books
              ========================= */}
              {!loading &&
                currentBooks.map((book) => {
                  const librarian =
                    book.librarianName ||
                    book.librarian ||
                    book.librarianId ||
                    "Unknown";

                  const isProcessing =
                    actionLoading === book._id;

                  return (
                    <tr
                      key={book._id}
                      className="border-t border-zinc-100 text-sm"
                    >
                      {/* Book */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-zinc-900">
                          {book.title}
                        </div>

                        <div className="text-xs text-zinc-500">
                          {book.author}
                        </div>
                      </td>

                      {/* Librarian */}
                      <td className="px-5 py-4 text-zinc-600">
                        {librarian}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 text-zinc-600">
                        {book.category || "N/A"}
                      </td>

                      {/* Fee */}
                      <td className="px-5 py-4 font-semibold">
                        ৳
                        {Number(
                          book.deliveryFee ??
                            book.fee ??
                            0
                        ).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                          {book.status || "pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Approve */}
                          <button
                            onClick={() =>
                              approve(
                                book._id
                              )
                            }
                            disabled={
                              isProcessing
                            }
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Check
                                size={15}
                              />
                            )}

                            Approve
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              remove(
                                book._id
                              )
                            }
                            disabled={
                              isProcessing
                            }
                            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2
                              size={15}
                            />

                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {/* =========================
                  Empty
              ========================= */}
              {!loading &&
                filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-zinc-500"
                    >
                      {query
                        ? "No pending books match your search."
                        : "No pending books found."}
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* =========================
            Pagination
        ========================= */}
        {!loading &&
          filtered.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Showing count */}
              <div className="text-sm text-zinc-500">
                Showing{" "}
                <span className="font-semibold text-zinc-700">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-zinc-700">
                  {Math.min(
                    endIndex,
                    filtered.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-zinc-700">
                  {filtered.length}
                </span>{" "}
                pending books
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <button
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={15}
                    />

                    <span className="hidden sm:inline">
                      Previous
                    </span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      {
                        length: totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          goToPage(page)
                        }
                        className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${
                          currentPage ===
                          page
                            ? "bg-zinc-900 text-white"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">
                      Next
                    </span>

                    <ChevronRight
                      size={15}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
      </div>
    </AdminShell>
  );
}