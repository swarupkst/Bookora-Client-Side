"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import BookCard from "@/components/ui/BookCard";
import { apiFetch } from "@/lib/api";

export default function BookGrid() {
  const [books, setBooks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [minFee, setMinFee] =
    useState("");

  const [maxFee, setMaxFee] =
    useState("");

  const [sort, setSort] =
    useState("newest");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      total: 0,
      totalPages: 1,
    });

  const limit = 12;

  async function fetchBooks() {
    try {
      setLoading(true);
      setError("");

      const params =
        new URLSearchParams();

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      if (category) {
        params.set(
          "category",
          category
        );
      }

      if (status) {
        params.set(
          "status",
          status
        );
      }

      if (minFee) {
        params.set(
          "minFee",
          minFee
        );
      }

      if (maxFee) {
        params.set(
          "maxFee",
          maxFee
        );
      }

      params.set("sort", sort);
      params.set(
        "page",
        page.toString()
      );
      params.set(
        "limit",
        limit.toString()
      );

      const result =
        await apiFetch(
          `/books?${params.toString()}`
        );

      setBooks(result.data);
      setPagination(
        result.pagination
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [
    page,
    category,
    status,
    sort,
    minFee,
    maxFee,
  ]);

  function handleSearch(e) {
    e.preventDefault();

    setPage(1);

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

  return (
    <>
      {/* Filters */}

      <div className="mb-10 rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5">
        <form
          onSubmit={handleSearch}
          className="grid gap-3 lg:grid-cols-12"
        >
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
            <option>
              Fiction
            </option>
            <option>
              Sci-Fi
            </option>
            <option>
              Academic
            </option>
            <option>
              Programming
            </option>
            <option>
              Self Development
            </option>
            <option>
              Biography
            </option>
          </select>

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

          <button
            type="submit"
            className="btn btn-primary rounded-xl lg:col-span-1"
          >
            Search
          </button>
        </form>

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

      {/* Result */}

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

      {!loading && error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!loading &&
        !error &&
        books.length === 0 && (
          <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 px-5 py-20 text-center">
            <h3 className="text-2xl font-black">
              No books found
            </h3>

            <p className="mt-2 text-base-content/50">
              Try changing your search or
              filters.
            </p>

            <button
              onClick={resetFilters}
              className="btn btn-primary mt-6 rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        )}

      {!loading &&
        !error &&
        books.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-base-content/55">
                Showing{" "}
                <span className="text-base-content">
                  {books.length}
                </span>{" "}
                of{" "}
                <span className="text-base-content">
                  {pagination.total}
                </span>{" "}
                books
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={{
                    ...book,
                    id: book._id,
                    image:
                      book.coverImage,
                    deliveryFee:
                      book.deliveryFee,
                    status:
                      book.status ===
                      "available"
                        ? "Available"
                        : "Checked Out",
                  }}
                />
              ))}
            </div>

            {/* Pagination */}

            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={
                  !pagination.hasPreviousPage
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1
                  )
                }
                className="btn btn-square btn-outline rounded-xl disabled:opacity-40"
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) =>
                    index + 1
                )
                  .slice(
                    Math.max(
                      page - 3,
                      0
                    ),
                    page + 2
                  )
                  .map(
                    (pageNumber) => (
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

              <button
                disabled={
                  !pagination.hasNextPage
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
                className="btn btn-square btn-outline rounded-xl disabled:opacity-40"
              >
                <ChevronRight
                  size={18}
                />
              </button>
            </div>
          </>
        )}
    </>
  );
}