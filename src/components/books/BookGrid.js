"use client";

import { useEffect, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import BookCard from "@/components/ui/BookCard";
import { getBook } from "@/lib/api/books";

export default function BookGrid() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [minFee, setMinFee] = useState("");
    const [maxFee, setMaxFee] = useState("");
    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);

    const limit = 12;

    async function fetchBooks() {
        try {
            setLoading(true);
            setError("");

            // Get all books from API
            const result = await getBook(null, "");

            const allBooks = result.data || [];

            // Search
            let filteredBooks = allBooks.filter((book) => {
                const searchText = search.trim().toLowerCase();

                if (!searchText) {
                    return true;
                }

                return (
                    book.title
                        ?.toLowerCase()
                        .includes(searchText) ||
                    book.author
                        ?.toLowerCase()
                        .includes(searchText)
                );
            });

            // Category filter
            if (category) {
                filteredBooks = filteredBooks.filter(
                    (book) =>
                        book.category === category
                );
            }

            // Availability filter
            if (status) {
                filteredBooks = filteredBooks.filter(
                    (book) => {
                        const isAvailable =
                            Number(book.quantity) >= 1;

                        if (status === "available") {
                            return isAvailable;
                        }

                        if (status === "checked_out") {
                            return !isAvailable;
                        }

                        return true;
                    }
                );
            }

            // Minimum delivery fee
            if (minFee !== "") {
                filteredBooks = filteredBooks.filter(
                    (book) =>
                        Number(book.deliveryFee) >=
                        Number(minFee)
                );
            }

            // Maximum delivery fee
            if (maxFee !== "") {
                filteredBooks = filteredBooks.filter(
                    (book) =>
                        Number(book.deliveryFee) <=
                        Number(maxFee)
                );
            }

            // Sorting
            filteredBooks.sort((a, b) => {
                switch (sort) {
                    case "oldest":
                        return (
                            new Date(a.createdAt) -
                            new Date(b.createdAt)
                        );

                    case "fee_low":
                        return (
                            Number(a.deliveryFee || 0) -
                            Number(b.deliveryFee || 0)
                        );

                    case "fee_high":
                        return (
                            Number(b.deliveryFee || 0) -
                            Number(a.deliveryFee || 0)
                        );

                    case "title_az":
                        return (a.title || "").localeCompare(
                            b.title || ""
                        );

                    case "newest":
                    default:
                        return (
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                        );
                }
            });

            setBooks(filteredBooks);
            setPage(1);
        } catch (err) {
            console.error("Books:", err);

            setError(
                err.message ||
                    "Failed to load books."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, [
        category,
        status,
        sort,
        minFee,
        maxFee,
    ]);

    function handleSearch(e) {
        e.preventDefault();

        fetchBooks();
    }

    function resetFilters() {
        setSearch("");
        setCategory("");
        setStatus("");
        setMinFee("");
        setMaxFee("");
        setSort("newest");
        setPage(1);
    }

    // Pagination
    const total = books.length;

    const totalPages = Math.max(
        1,
        Math.ceil(total / limit)
    );

    const startIndex =
        (page - 1) * limit;

    const paginatedBooks = books.slice(
        startIndex,
        startIndex + limit
    );

    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return (
        <>
            {/* Filters */}

            <div className="mb-10 rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5">
                <form
                    onSubmit={handleSearch}
                    className="grid gap-3 lg:grid-cols-12"
                >
                    {/* Search */}

                    <label className="input input-bordered flex items-center gap-2 rounded-xl lg:col-span-5">
                        <Search
                            size={18}
                            className="text-base-content/40"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            type="search"
                            placeholder="Search title or author..."
                            className="grow"
                        />
                    </label>

                    {/* Category */}

                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(
                                e.target.value
                            );
                            setPage(1);
                        }}
                        className="select select-bordered rounded-xl lg:col-span-2"
                    >
                        <option value="">
                            All Categories
                        </option>

                        <option value="Fiction">
                            Fiction
                        </option>

                        <option value="Sci-Fi">
                            Sci-Fi
                        </option>

                        <option value="Academic">
                            Academic
                        </option>

                        <option value="Programming">
                            Programming
                        </option>

                        <option value="Self Development">
                            Self Development
                        </option>

                        <option value="Biography">
                            Biography
                        </option>
                    </select>

                    {/* Availability */}

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(
                                e.target.value
                            );
                            setPage(1);
                        }}
                        className="select select-bordered rounded-xl lg:col-span-2"
                    >
                        <option value="">
                            All Availability
                        </option>

                        <option value="available">
                            Available
                        </option>

                        <option value="checked_out">
                            Checked Out
                        </option>
                    </select>

                    {/* Sort */}

                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(
                                e.target.value
                            );
                            setPage(1);
                        }}
                        className="select select-bordered rounded-xl lg:col-span-2"
                    >
                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="fee_low">
                            Fee: Low to High
                        </option>

                        <option value="fee_high">
                            Fee: High to Low
                        </option>

                        <option value="title_az">
                            Title: A-Z
                        </option>
                    </select>

                    {/* Search Button */}

                    <button
                        type="submit"
                        className="btn btn-primary rounded-xl lg:col-span-1"
                    >
                        Search
                    </button>
                </form>

                {/* Delivery Fee */}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-base-content/60">
                        Delivery fee:
                    </span>

                    <input
                        value={minFee}
                        onChange={(e) => {
                            setMinFee(
                                e.target.value
                            );
                            setPage(1);
                        }}
                        type="number"
                        min="0"
                        placeholder="Min"
                        className="input input-sm input-bordered w-24 rounded-lg"
                    />

                    <span className="text-base-content/40">
                        -
                    </span>

                    <input
                        value={maxFee}
                        onChange={(e) => {
                            setMaxFee(
                                e.target.value
                            );
                            setPage(1);
                        }}
                        type="number"
                        min="0"
                        placeholder="Max"
                        className="input input-sm input-bordered w-24 rounded-lg"
                    />

                    <button
                        onClick={resetFilters}
                        type="button"
                        className="btn btn-ghost btn-sm ml-auto rounded-lg"
                    >
                        <SlidersHorizontal
                            size={15}
                        />
                        Reset
                    </button>
                </div>
            </div>

            {/* Loading */}

            {loading && (
                <div className="flex min-h-72 items-center justify-center">
                    <div className="text-center">
                        <span className="loading loading-spinner loading-lg text-primary" />

                        <p className="mt-3 text-sm text-base-content/50">
                            Loading books...
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}

            {!loading && error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {/* No Books */}

            {!loading &&
                !error &&
                paginatedBooks.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 px-5 py-20 text-center">
                        <h3 className="text-2xl font-black">
                            No books found
                        </h3>

                        <p className="mt-2 text-base-content/50">
                            Try changing your search
                            or filters.
                        </p>

                        <button
                            onClick={resetFilters}
                            className="btn btn-primary mt-6 rounded-xl"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

            {/* Books */}

            {!loading &&
                !error &&
                paginatedBooks.length > 0 && (
                    <>
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-sm font-semibold text-base-content/55">
                                Showing{" "}
                                <span className="text-base-content">
                                    {startIndex + 1}
                                </span>{" "}
                                -{" "}
                                <span className="text-base-content">
                                    {Math.min(
                                        startIndex +
                                            limit,
                                        total
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="text-base-content">
                                    {total}
                                </span>{" "}
                                books
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {paginatedBooks.map(
                                (book) => (
                                    <BookCard
                                        key={
                                            book._id
                                        }
                                        book={{
                                            ...book,
                                            id: book._id,

                                            // Prevent empty src=""
                                            image:
                                                book.coverImage ||
                                                null,

                                            deliveryFee:
                                                book.deliveryFee,

                                            status:
                                                Number(
                                                    book.quantity
                                                ) >= 1
                                                    ? "Available"
                                                    : "Checked Out",
                                        }}
                                    />
                                )
                            )}
                        </div>

                        {/* Pagination */}

                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                {/* Previous */}

                                <button
                                    disabled={
                                        !hasPreviousPage
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                current -
                                                1
                                        )
                                    }
                                    className="btn btn-square btn-outline rounded-xl disabled:opacity-40"
                                >
                                    <ChevronLeft
                                        size={18}
                                    />
                                </button>

                                {/* Page Numbers */}

                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) =>
                                            index + 1
                                    )
                                        .slice(
                                            Math.max(
                                                page -
                                                    3,
                                                0
                                            ),
                                            page + 2
                                        )
                                        .map(
                                            (
                                                pageNumber
                                            ) => (
                                                <button
                                                    key={
                                                        pageNumber
                                                    }
                                                    onClick={() =>
                                                        setPage(
                                                            pageNumber
                                                        )
                                                    }
                                                    className={`btn btn-square rounded-xl ${
                                                        pageNumber ===
                                                        page
                                                            ? "btn-primary"
                                                            : "btn-ghost"
                                                    }`}
                                                >
                                                    {
                                                        pageNumber
                                                    }
                                                </button>
                                            )
                                        )}
                                </div>

                                {/* Next */}

                                <button
                                    disabled={
                                        !hasNextPage
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                current +
                                                1
                                        )
                                    }
                                    className="btn btn-square btn-outline rounded-xl disabled:opacity-40"
                                >
                                    <ChevronRight
                                        size={18}
                                    />
                                </button>
                            </div>
                        )}
                    </>
                )}
        </>
    );
}