"use client";

import Image from "next/image";
import Link from "next/link";

import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    Truck,
    User,
} from "lucide-react";

import { useEffect, useState } from "react";

import { getBookById } from "@/lib/api/books";

export default function BookDetails({ id }) {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBook() {
            try {
                setLoading(true);
                setError("");

                const result =
                    await getBookById(id);

                setBook(result.data);
            } catch (err) {
                console.error(
                    "Book details:",
                    err
                );

                setError(
                    err.message ||
                        "Failed to load book."
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadBook();
        }
    }, [id]);

    if (loading) {
        return (
            <section className="flex min-h-[600px] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </section>
        );
    }

    if (error || !book) {
        return (
            <section className="mx-auto max-w-7xl px-5 py-24 text-center">
                <h1 className="text-3xl font-black">
                    Book not found
                </h1>

                <p className="mt-3 text-base-content/60">
                    {error ||
                        "This book is no longer available."}
                </p>

                <Link
                    href="/browse"
                    className="btn btn-primary mt-7 rounded-xl"
                >
                    <ArrowLeft size={17} />
                    Browse Books
                </Link>
            </section>
        );
    }

    // Book is available only when quantity is 1 or more
    const unavailable =
        Number(book.quantity) < 1;

    return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
            <Link
                href="/browse"
                className="btn btn-ghost mb-8 rounded-xl"
            >
                <ArrowLeft size={17} />
                Back to Browse
            </Link>

            <div className="grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-16">
                {/* Cover */}

                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-base-200 shadow-xl">
                    {book.coverImage ? (
                        <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 400px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <BookOpen
                                size={70}
                                className="text-base-content/20"
                            />
                        </div>
                    )}
                </div>

                {/* Information */}

                <div>
                    <div className="flex flex-wrap gap-2">
                        <span className="badge badge-primary badge-outline px-3 py-3">
                            {book.category}
                        </span>

                        <span
                            className={`badge px-3 py-3 ${
                                unavailable
                                    ? "badge-error"
                                    : "badge-success"
                            }`}
                        >
                            {unavailable
                                ? "Unavailable"
                                : "Available"}
                        </span>
                    </div>

                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                        {book.title}
                    </h1>

                    <p className="mt-4 flex items-center gap-2 text-lg text-base-content/60">
                        <User size={18} />
                        {book.author}
                    </p>

                    <div className="my-8 h-px bg-base-300" />

                    <p className="text-base leading-8 text-base-content/65">
                        {book.description}
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-base-100 p-5 shadow-sm">
                            <Truck
                                size={20}
                                className="text-primary"
                            />

                            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-base-content/45">
                                Delivery Fee
                            </p>

                            <p className="mt-1 text-2xl font-black">
                                ৳{book.deliveryFee}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-base-100 p-5 shadow-sm">
                            <CalendarDays
                                size={20}
                                className="text-primary"
                            />

                            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-base-content/45">
                                Date Added
                            </p>

                            <p className="mt-1 font-bold">
                                {book.createdAt
                                    ? new Date(
                                          book.createdAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    <button
                        disabled={unavailable}
                        className="btn btn-primary btn-lg mt-8 w-full rounded-xl sm:w-auto"
                    >
                        <Truck size={19} />

                        {unavailable
                            ? "Currently Unavailable"
                            : "Request Delivery"}
                    </button>

                    {unavailable && (
                        <p className="mt-3 text-sm text-error">
                            This book is currently
                            unavailable.
                        </p>
                    )}

                    <div className="mt-8 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen size={18} />
                        </div>

                        <div>
                            <p className="text-sm font-bold">
                                Listed by{" "}
                                {book.librarianName ||
                                    "Bookora Librarian"}
                            </p>

                            {book.librarianEmail && (
                                <p className="text-xs text-base-content/50">
                                    {
                                        book.librarianEmail
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews */}

            <section className="mt-20 border-t border-base-300 pt-12">
                <h2 className="text-3xl font-black">
                    Reviews
                </h2>

                <p className="mt-3 text-base-content/55">
                    Reviews from verified readers will
                    appear here.
                </p>
            </section>
        </section>
    );
}