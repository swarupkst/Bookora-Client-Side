"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Trash2,
    BookOpen,
    Loader2,
} from "lucide-react";

import Shell from "@/components/user/Shell";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
    const {
        data: session,
        isPending: sessionLoading,
    } = authClient.useSession();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] =
        useState(null);

    /*
     * =====================================================
     * FETCH WISHLIST
     * =====================================================
     */

    useEffect(() => {
        if (sessionLoading) return;

        if (!session?.user?.id) {
            setBooks([]);
            setLoading(false);
            return;
        }

        const fetchWishlist = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/api/wishlist?userId=${encodeURIComponent(
                        session.user.id
                    )}`,
                    {
                        credentials: "include",
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch wishlist"
                    );
                }

                setBooks(data.data || []);
            } catch (error) {
                console.error(
                    "Wishlist fetch error:",
                    error
                );

                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [session, sessionLoading]);

    /*
     * =====================================================
     * REMOVE FROM WISHLIST
     * =====================================================
     */

    async function remove(bookId) {
        if (!session?.user?.id || !bookId) {
            return;
        }

        try {
            setRemovingId(bookId);

            const response = await fetch(
                `${API_URL}/api/wishlist`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        userId:
                            session.user.id,
                        bookId,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to remove wishlist item"
                );
            }

            // Remove from UI immediately
            setBooks((prev) =>
                prev.filter(
                    (item) =>
                        String(item.bookId) !==
                        String(bookId)
                )
            );
        } catch (error) {
            console.error(
                "Remove wishlist error:",
                error
            );
        } finally {
            setRemovingId(null);
        }
    }

    /*
     * =====================================================
     * LOADING
     * =====================================================
     */

    if (
        sessionLoading ||
        loading
    ) {
        return (
            <Shell>
                <div className="mx-auto flex max-w-7xl items-center justify-center py-20">
                    <Loader2
                        className="animate-spin"
                        size={30}
                    />
                </div>
            </Shell>
        );
    }

    /*
     * =====================================================
     * PAGE
     * =====================================================
     */

    return (
        <Shell>
            <div className="mx-auto max-w-7xl">
                {/* Header */}

                <div>
                    <h2 className="text-2xl font-black tracking-tight text-base-content">
                        Reading List
                    </h2>

                    <p className="mt-1 text-sm text-base-content/60">
                        Your saved books and wishlist
                        items.
                    </p>
                </div>

                {/* Wishlist Grid */}

                {books.length > 0 && (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {books.map((item) => {
                            const book =
                                item.book || {};

                            return (
                                <article
                                    key={item._id}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
                                >
                                    {/* Cover */}

                                    <Link
                                        href={`/books/${item.bookId}`}
                                        className="block"
                                    >
                                        <div className="relative h-64 overflow-hidden bg-base-200">
                                            {book.coverImage ? (
                                                <img
                                                    src={
                                                        book.coverImage
                                                    }
                                                    alt={
                                                        book.title ||
                                                        "Book cover"
                                                    }
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
                                                    <BookOpen
                                                        size={
                                                            52
                                                        }
                                                        className="text-base-content/20"
                                                    />
                                                </div>
                                            )}

                                            {/* Bottom Gradient */}

                                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

                                            {/* Category */}

                                            {book.category && (
                                                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-violet-700 shadow-md backdrop-blur-sm">
                                                    {
                                                        book.category
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Details */}

                                    <div className="flex flex-1 flex-col p-5">
                                        {/* Title */}

                                        <Link
                                            href={`/books/${item.bookId}`}
                                        >
                                            <h3 className="line-clamp-2 min-h-[48px] text-lg font-extrabold leading-6 text-base-content transition-colors duration-200 hover:text-violet-600">
                                                {book.title ||
                                                    "Untitled Book"}
                                            </h3>
                                        </Link>

                                        {/* Author */}

                                        <p className="mt-1 line-clamp-1 text-sm text-base-content/60">
                                            by{" "}
                                            <span className="font-medium">
                                                {book.author ||
                                                    "Unknown Author"}
                                            </span>
                                        </p>

                                        {/* Divider */}

                                        <div className="my-4 border-t border-base-300" />

                                        {/* Meta Information */}

                                        <div className="flex items-center justify-between gap-3">
                                            {/* Delivery Fee */}

                                            <div>
                                                <p className="text-xs font-medium text-base-content/50">
                                                    Delivery
                                                    fee
                                                </p>

                                                <p className="mt-0.5 text-base font-extrabold text-violet-600">
                                                    ৳
                                                    {Number(
                                                        book.deliveryFee ||
                                                            0
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </p>
                                            </div>

                                            {/* Librarian */}

                                            {book.librarianName && (
                                                <div className="max-w-[55%] text-right">
                                                    <p className="text-xs text-base-content/50">
                                                        Listed
                                                        by
                                                    </p>

                                                    <p className="truncate text-sm font-semibold text-base-content/70">
                                                        {
                                                            book.librarianName
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}

                                        <div className="mt-5 flex gap-2">
                                            <Link
                                                href={`/books/${item.bookId}`}
                                                className="btn-primary flex h-11 flex-1 items-center justify-center gap-2 rounded-xl"
                                            >
                                                <BookOpen
                                                    size={
                                                        16
                                                    }
                                                />

                                                View Book
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    remove(
                                                        item.bookId
                                                    )
                                                }
                                                disabled={
                                                    removingId ===
                                                    item.bookId
                                                }
                                                className="btn-danger cursor-pointer text-red-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                                                title="Remove from wishlist"
                                            >
                                                {removingId ===
                                                item.bookId ? (
                                                    <Loader2
                                                        size={
                                                            17
                                                        }
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <Trash2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Empty Wishlist */}

                {!books.length && (
                    <div className="card mt-6 rounded-2xl border border-base-300 bg-base-100 p-10 text-center text-base-content/60 shadow-sm">
                        <BookOpen
                            size={42}
                            className="mx-auto mb-4 opacity-30"
                        />

                        <h3 className="font-bold text-base-content">
                            Your wishlist is empty.
                        </h3>

                        <p className="mt-1 text-sm">
                            Save books you want to
                            read later.
                        </p>
                    </div>
                )}
            </div>
        </Shell>
    );
}
