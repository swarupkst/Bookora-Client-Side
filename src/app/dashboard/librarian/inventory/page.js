"use client";

import Shell from "@/components/librarian/Shell";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Toaster, toast } from "sonner";
import { X, AlertTriangle } from "lucide-react";

export default function Inventory() {
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: null,
        book: null,
    });

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (sessionLoading) return;

        if (!session?.user?.id) {
            setError("Unable to identify the logged-in librarian.");
            setLoading(false);
            return;
        }

        const fetchBooks = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(
                    `${baseUrl}/api/books?librarianId=${session.user.id}`,
                    {
                        cache: "no-store",
                    }
                );

                const result = await res.json();

                if (!res.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to fetch books"
                    );
                }

                setRows(result.data || []);
            } catch (error) {
                console.error("Fetch books error:", error);

                setError(
                    error.message || "Failed to load books"
                );

                toast.error(
                    error.message || "Failed to load books"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [session, sessionLoading, baseUrl]);

    // Open confirmation dialog
    const openConfirmation = (type, book) => {
        setConfirmDialog({
            open: true,
            type,
            book,
        });
    };

    // Close confirmation dialog
    const closeConfirmation = () => {
        if (actionLoading) return;

        setConfirmDialog({
            open: false,
            type: null,
            book: null,
        });
    };

    // Delete book
    const handleDelete = async (bookId) => {
        try {
            setActionLoading(bookId);

            const res = await fetch(
                `${baseUrl}/api/books/${bookId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        librarianId: session.user.id,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to delete book"
                );
            }

            setRows((prev) =>
                prev.filter((book) => book._id !== bookId)
            );

            toast.success("Book deleted successfully.");
        } catch (error) {
            console.error("Delete book error:", error);

            toast.error(
                error.message || "Failed to delete book"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // Unpublish book
    const handleUnpublish = async (bookId) => {
        try {
            setActionLoading(bookId);

            const res = await fetch(
                `${baseUrl}/api/books/${bookId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        librarianId: session.user.id,
                        status: "unpublished",
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to unpublish book"
                );
            }

            setRows((prev) =>
                prev.map((book) =>
                    book._id === bookId
                        ? {
                              ...book,
                              status: "unpublished",
                          }
                        : book
                )
            );

            toast.success("Book unpublished successfully.");
        } catch (error) {
            console.error("Unpublish book error:", error);

            toast.error(
                error.message || "Failed to unpublish book"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // Confirm selected action
    const handleConfirmedAction = async () => {
        const { type, book } = confirmDialog;

        if (!book || !type) return;

        setConfirmDialog({
            open: false,
            type: null,
            book: null,
        });

        if (type === "delete") {
            await handleDelete(book._id);
        }

        if (type === "unpublish") {
            await handleUnpublish(book._id);
        }
    };

    return (
        <Shell>
            <Toaster
                position="top-right"
                richColors
                closeButton
                duration={3500}
            />

            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black">
                        Manage Inventory
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your books and their approval status.
                    </p>
                </div>

                <Link
                    href="/dashboard/librarian/add-book"
                    className="rounded-xl bg-[#5b4bdb] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#4d3ec4]"
                >
                    + Add Book
                </Link>
            </div>

            {loading && (
                <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Loading books...
                </div>
            )}

            {error && !loading && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                    <table className="w-full min-w-[1000px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="p-4">Book</th>
                                <th>Category</th>
                                <th>Fee</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-8 text-center text-sm text-slate-500"
                                    >
                                        You have not added any books yet.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((book) => (
                                    <tr key={book._id}>
                                        <td className="p-4">
                                            <b>{book.title}</b>

                                            <p className="text-xs text-slate-500">
                                                {book.author}
                                            </p>
                                        </td>

                                        <td>
                                            {book.category}
                                        </td>

                                        <td>
                                            ৳{book.deliveryFee}
                                        </td>

                                        <td>
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                                    book.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : book.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : book.status === "unpublished"
                                                        ? "bg-slate-200 text-slate-600"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {book.status}
                                            </span>
                                        </td>

                                        <td className="py-4">
                                            <div className="flex flex-wrap gap-2">

                                                {/* Edit */}
                                                <Link
                                                    href={`/dashboard/librarian/edit-book/${book._id}`}
                                                    className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
                                                >
                                                    Edit
                                                </Link>

                                                {/* Unpublish */}
                                                {book.status !== "unpublished" && (
                                                    <button
                                                        onClick={() =>
                                                            openConfirmation(
                                                                "unpublish",
                                                                book
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            book._id
                                                        }
                                                        className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {actionLoading ===
                                                        book._id
                                                            ? "Processing..."
                                                            : "Unpublish"}
                                                    </button>
                                                )}

                                                {/* Delete */}
                                                <button
                                                    onClick={() =>
                                                        openConfirmation(
                                                            "delete",
                                                            book
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        book._id
                                                    }
                                                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {actionLoading ===
                                                    book._id
                                                        ? "Processing..."
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmDialog.open && confirmDialog.book && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        {/* Close */}
                        <button
                            onClick={closeConfirmation}
                            className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>

                        {/* Icon */}
                        <div
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                                confirmDialog.type === "delete"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-orange-100 text-orange-600"
                            }`}
                        >
                            <AlertTriangle size={24} />
                        </div>

                        <h2 className="text-xl font-black text-slate-900">
                            {confirmDialog.type === "delete"
                                ? "Delete Book?"
                                : "Unpublish Book?"}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {confirmDialog.type === "delete"
                                ? "Are you sure you want to permanently delete this book? This action cannot be undone."
                                : "Are you sure you want to unpublish this book? It will no longer be available as a published book."}
                        </p>

                        {/* Book info */}
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                            <p className="font-bold text-slate-900">
                                {confirmDialog.book.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {confirmDialog.book.author}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={closeConfirmation}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmedAction}
                                className={`rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${
                                    confirmDialog.type === "delete"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-orange-600 hover:bg-orange-700"
                                }`}
                            >
                                {confirmDialog.type === "delete"
                                    ? "Delete Book"
                                    : "Unpublish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Shell>
    );
}