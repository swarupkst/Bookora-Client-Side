
"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
    Search,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
    AlertTriangle,
    Globe,
    EyeOff,
} from "lucide-react";
import { Toaster, toast } from "sonner";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BOOKS_PER_PAGE = 10;

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);

    // =========================
    // Confirmation dialog
    // =========================
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: null,
        book: null,
        title: "",
        message: "",
    });

    // =========================
    // Fetch all books
    // =========================
    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/books`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch books"
                );
            }

            const result = await response.json();

            if (Array.isArray(result)) {
                setBooks(result);
            } else if (Array.isArray(result.data)) {
                setBooks(result.data);
            } else {
                setBooks([]);
            }
        } catch (err) {
            console.error(
                "Fetch books error:",
                err
            );

            const message =
                "Failed to load books. Please try again.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // Search filtering
    // =========================
    const filtered = useMemo(() => {
        const searchText = query
            .toLowerCase()
            .trim();

        if (!searchText) {
            return books;
        }

        return books.filter((book) => {
            const title = book.title || "";
            const author = book.author || "";

            const librarian =
                book.librarianName ||
                book.librarian ||
                book.librarianEmail ||
                "";

            const category = book.category || "";
            const status = book.status || "";

            return `${title} ${author} ${librarian} ${category} ${status}`
                .toLowerCase()
                .includes(searchText);
        });
    }, [books, query]);

    // =========================
    // Pagination
    // =========================
    const totalPages = Math.ceil(
        filtered.length / BOOKS_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) *
        BOOKS_PER_PAGE;

    const endIndex =
        startIndex + BOOKS_PER_PAGE;

    const currentBooks = filtered.slice(
        startIndex,
        endIndex
    );

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    // Keep current page valid after delete/filter
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
    // Status helpers
    // =========================
    function getStatusLabel(status) {
        if (status === "approved")
            return "Approved";

        if (status === "unpublished")
            return "Unpublished";

        if (status === "pending")
            return "Pending";

        return status || "Unknown";
    }

    function getStatusClass(status) {
        if (status === "approved") {
            return "bg-emerald-50 text-emerald-700";
        }

        if (status === "pending") {
            return "bg-amber-50 text-amber-700";
        }

        if (status === "unpublished") {
            return "bg-zinc-100 text-zinc-600";
        }

        return "bg-zinc-100 text-zinc-600";
    }

    // =========================
    // Open confirmation popup
    // =========================
    function openConfirmation(type, book) {
        if (!book?._id) {
            return;
        }

        if (type === "publish") {
            setConfirmDialog({
                open: true,
                type: "publish",
                book,
                title: "Publish Book?",
                message: `Are you sure you want to publish "${book.title}"? The book will become visible to users.`,
            });

            return;
        }

        if (type === "unpublish") {
            setConfirmDialog({
                open: true,
                type: "unpublish",
                book,
                title: "Unpublish Book?",
                message: `Are you sure you want to unpublish "${book.title}"? It will no longer be publicly available.`,
            });

            return;
        }

        if (type === "delete") {
            setConfirmDialog({
                open: true,
                type: "delete",
                book,
                title: "Delete Book?",
                message: `Are you sure you want to permanently delete "${book.title}"? This action cannot be undone.`,
            });
        }
    }

    // =========================
    // Close confirmation popup
    // =========================
    function closeConfirmation() {
        if (actionLoading) {
            return;
        }

        setConfirmDialog({
            open: false,
            type: null,
            book: null,
            title: "",
            message: "",
        });
    }

    // =========================
    // Toggle Approved / Unpublished
    // =========================
    async function toggleStatus(book) {
        if (!book?._id) {
            return;
        }

        // Pending books must go through approval queue
        if (book.status === "pending") {
            toast.warning(
                "Pending books must be approved first."
            );

            return;
        }

        const newStatus =
            book.status === "approved"
                ? "unpublished"
                : "approved";

        try {
            setActionLoading(book._id);
            setError("");

            const response = await fetch(
                `${API_URL}/api/admin/books/${book._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Failed to update book status"
                );
            }

            // Update UI immediately
            setBooks((prev) =>
                prev.map((item) =>
                    item._id === book._id
                        ? {
                              ...item,
                              status: newStatus,
                          }
                        : item
                )
            );

            if (newStatus === "approved") {
                toast.success(
                    `"${book.title}" published successfully.`
                );
            } else {
                toast.success(
                    `"${book.title}" unpublished successfully.`
                );
            }
        } catch (err) {
            console.error(
                "Toggle status error:",
                err
            );

            toast.error(
                err.message ||
                    "Failed to update book status."
            );
        } finally {
            setActionLoading(null);
        }
    }

    // =========================
    // Delete book
    // =========================
    async function remove(book) {
        if (!book?._id) {
            return;
        }

        try {
            setActionLoading(book._id);
            setError("");

            const response = await fetch(
                `${API_URL}/api/admin/books/${book._id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Failed to delete book"
                );
            }

            // Remove from UI
            setBooks((prev) =>
                prev.filter(
                    (item) =>
                        item._id !== book._id
                )
            );

            toast.success(
                `"${book.title}" deleted successfully.`
            );
        } catch (err) {
            console.error(
                "Delete book error:",
                err
            );

            toast.error(
                err.message ||
                    "Failed to delete book."
            );
        } finally {
            setActionLoading(null);
        }
    }

    // =========================
    // Confirm selected action
    // =========================
    async function handleConfirmedAction() {
        const {
            type,
            book,
        } = confirmDialog;

        if (!type || !book?._id) {
            return;
        }

        // Close popup before API action
        setConfirmDialog({
            open: false,
            type: null,
            book: null,
            title: "",
            message: "",
        });

        if (
            type === "publish" ||
            type === "unpublish"
        ) {
            await toggleStatus(book);
            return;
        }

        if (type === "delete") {
            await remove(book);
        }
    }

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
        <>
            {/* =========================
                Toast
            ========================= */}
            <Toaster
                position="top-right"
                richColors
                closeButton
                duration={3500}
            />

            <AdminShell
                title="Manage All Books"
                subtitle="Control every book listing on BookOra."
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
                            setQuery(
                                e.target.value
                            )
                        }
                        placeholder="Search books..."
                        className="w-full bg-transparent text-sm outline-none"
                    />
                </div>

                {/* =========================
                    Error
                ========================= */}
                {error && (
                    <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        <span>{error}</span>

                        <button
                            onClick={() =>
                                setError("")
                            }
                            className="rounded-md p-1 transition hover:bg-red-100"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* =========================
                    Table
                ========================= */}
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-[950px] w-full text-left">
                            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                                <tr>
                                    <th className="px-5 py-3">
                                        Book
                                    </th>

                                    <th className="px-5 py-3">
                                        Author
                                    </th>

                                    <th className="px-5 py-3">
                                        Librarian
                                    </th>

                                    <th className="px-5 py-3">
                                        Category
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
                                {/* Loading */}
                                {loading && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-5 py-12 text-center text-sm text-zinc-500"
                                        >
                                            Loading books...
                                        </td>
                                    </tr>
                                )}

                                {/* Empty */}
                                {!loading &&
                                    currentBooks.length ===
                                        0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-5 py-12 text-center"
                                            >
                                                <div className="text-sm font-semibold text-zinc-700">
                                                    No books
                                                    found.
                                                </div>

                                                <div className="mt-1 text-xs text-zinc-400">
                                                    {query
                                                        ? "Try a different search term."
                                                        : "There are no books available."}
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                {/* Books */}
                                {!loading &&
                                    currentBooks.map(
                                        (book) => {
                                            const isLoading =
                                                actionLoading ===
                                                book._id;

                                            const isPending =
                                                book.status ===
                                                "pending";

                                            return (
                                                <tr
                                                    key={
                                                        book._id
                                                    }
                                                    className="border-t border-zinc-100 text-sm"
                                                >
                                                    {/* Book */}
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-zinc-900">
                                                            {
                                                                book.title
                                                            }
                                                        </div>
                                                    </td>

                                                    {/* Author */}
                                                    <td className="px-5 py-4 text-zinc-600">
                                                        {book.author ||
                                                            "—"}
                                                    </td>

                                                    {/* Librarian */}
                                                    <td className="px-5 py-4 text-zinc-600">
                                                        {book.librarianName ||
                                                            book.librarian ||
                                                            book.librarianEmail ||
                                                            "—"}
                                                    </td>

                                                    {/* Category */}
                                                    <td className="px-5 py-4 text-zinc-600">
                                                        {book.category ||
                                                            "—"}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${getStatusClass(
                                                                book.status
                                                            )}`}
                                                        >
                                                            {getStatusLabel(
                                                                book.status
                                                            )}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            {/* Publish / Unpublish */}
                                                            <button
                                                                onClick={() => {
                                                                    if (
                                                                        isPending
                                                                    ) {
                                                                        toast.warning(
                                                                            "Pending books must be approved first."
                                                                        );

                                                                        return;
                                                                    }

                                                                    openConfirmation(
                                                                        book.status ===
                                                                            "approved"
                                                                            ? "unpublish"
                                                                            : "publish",
                                                                        book
                                                                    );
                                                                }}
                                                                disabled={
                                                                    isLoading
                                                                }
                                                                title={
                                                                    isPending
                                                                        ? "Pending books must be approved first"
                                                                        : ""
                                                                }
                                                                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
                                                                    isPending
                                                                        ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                                                                        : "bg-violet-50 text-violet-700 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                                }`}
                                                            >
                                                                {isLoading ? (
                                                                    "Updating..."
                                                                ) : book.status ===
                                                                  "approved" ? (
                                                                    <>
                                                                        <EyeOff
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                        Unpublish
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Globe
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                        Publish
                                                                    </>
                                                                )}
                                                            </button>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={() =>
                                                                    openConfirmation(
                                                                        "delete",
                                                                        book
                                                                    )
                                                                }
                                                                disabled={
                                                                    isLoading
                                                                }
                                                                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {isLoading
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
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
                                {/* Result count */}
                                <div className="text-sm text-zinc-500">
                                    Showing{" "}
                                    <span className="font-semibold text-zinc-700">
                                        {startIndex +
                                            1}
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
                                        {
                                            filtered.length
                                        }
                                    </span>{" "}
                                    books
                                </div>

                                {/* Pagination buttons */}
                                {totalPages >
                                    1 && (
                                    <div className="flex items-center gap-1">
                                        {/* Previous */}
                                        <button
                                            onClick={() =>
                                                goToPage(
                                                    currentPage -
                                                        1
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                1
                                            }
                                            className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <ChevronLeft
                                                size={
                                                    15
                                                }
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
                                                (
                                                    _,
                                                    index
                                                ) =>
                                                    index +
                                                    1
                                            ).map(
                                                (
                                                    page
                                                ) => (
                                                    <button
                                                        key={
                                                            page
                                                        }
                                                        onClick={() =>
                                                            goToPage(
                                                                page
                                                            )
                                                        }
                                                        className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${
                                                            currentPage ===
                                                            page
                                                                ? "bg-zinc-900 text-white"
                                                                : "text-zinc-600 hover:bg-zinc-100"
                                                        }`}
                                                    >
                                                        {
                                                            page
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        {/* Next */}
                                        <button
                                            onClick={() =>
                                                goToPage(
                                                    currentPage +
                                                        1
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
                                                size={
                                                    15
                                                }
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </AdminShell>

            {/* =========================
                Confirmation Modal
            ========================= */}
            {confirmDialog.open && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        {/* Icon */}
                        <div
                            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                                confirmDialog.type ===
                                "delete"
                                    ? "bg-red-100 text-red-600"
                                    : confirmDialog.type ===
                                      "unpublish"
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-violet-100 text-violet-600"
                            }`}
                        >
                            {confirmDialog.type ===
                            "delete" ? (
                                <AlertTriangle
                                    size={24}
                                />
                            ) : confirmDialog.type ===
                              "unpublish" ? (
                                <EyeOff
                                    size={24}
                                />
                            ) : (
                                <Globe
                                    size={24}
                                />
                            )}
                        </div>

                        {/* Title */}
                        <h2 className="text-center text-lg font-bold text-zinc-900">
                            {
                                confirmDialog.title
                            }
                        </h2>

                        {/* Message */}
                        <p className="mt-2 text-center text-sm leading-6 text-zinc-500">
                            {
                                confirmDialog.message
                            }
                        </p>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={
                                    closeConfirmation
                                }
                                disabled={
                                    !!actionLoading
                                }
                                className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    handleConfirmedAction
                                }
                                disabled={
                                    !!actionLoading
                                }
                                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    confirmDialog.type ===
                                    "delete"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : confirmDialog.type ===
                                          "unpublish"
                                        ? "bg-amber-600 hover:bg-amber-700"
                                        : "bg-violet-600 hover:bg-violet-700"
                                }`}
                            >
                                {confirmDialog.type ===
                                "delete" ? (
                                    <>
                                        <Trash2
                                            size={
                                                16
                                            }
                                        />
                                        Delete
                                    </>
                                ) : confirmDialog.type ===
                                  "unpublish" ? (
                                    <>
                                        <EyeOff
                                            size={
                                                16
                                            }
                                        />
                                        Unpublish
                                    </>
                                ) : (
                                    <>
                                        <Globe
                                            size={
                                                16
                                            }
                                        />
                                        Publish
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
