"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import BookCard from "@/components/ui/BookCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBook } from "@/lib/api/books";

export default function FeaturedBooksDynamic() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBooks() {
            try {
                // Get only approved books
                const result = await getBook(null, "approved");

                // Sort by newest and show only 6 books
                const newestBooks = (result.data || [])
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    )
                    .slice(0, 6);

                setBooks(newestBooks);
            } catch (error) {
                console.error("Featured books:", error);
            } finally {
                setLoading(false);
            }
        }

        loadBooks();
    }, []);

    return (
        <section className="bg-base-100 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <SectionHeading
                        eyebrow="Featured Collection"
                        title="Books worth discovering"
                        description="Fresh picks from our local library community."
                    />

                    <Link
                        href="/browse"
                        className="group mb-10 hidden items-center gap-2 text-sm font-bold text-primary sm:flex"
                    >
                        Browse all books

                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                )}

                {/* No books */}
                {!loading && books.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-base-300 p-16 text-center">
                        <h3 className="text-xl font-bold">
                            No featured books yet
                        </h3>

                        <p className="mt-2 text-sm text-base-content/50">
                            New books will appear here after admin approval.
                        </p>
                    </div>
                )}

                {/* Books */}
                {!loading && books.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {books.map((book) => (
                            <BookCard
                                key={book._id}
                                book={{
                                    id: book._id,
                                    title: book.title,
                                    author: book.author,
                                    category: book.category,
                                    deliveryFee: book.deliveryFee,
                                    image: book.coverImage,
                                    status: "Available",
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}