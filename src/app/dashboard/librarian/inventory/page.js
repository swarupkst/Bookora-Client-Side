'use client';

import Shell from "@/components/librarian/Shell";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Inventory() {
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [session, sessionLoading, baseUrl]);

    const handleDelete = async (bookId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmed) return;

        try {
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

        } catch (error) {
            console.error("Delete book error:", error);

            alert(
                error.message || "Failed to delete book"
            );
        }
    };

    return (
        <Shell>
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
                    className="rounded-xl bg-[#5b4bdb] px-4 py-3 text-center text-sm font-bold text-white"
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
                    <table className="w-full min-w-[800px] text-left text-sm">
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
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">
                                                {book.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleDelete(book._id)
                                                }
                                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </Shell>
    );
}