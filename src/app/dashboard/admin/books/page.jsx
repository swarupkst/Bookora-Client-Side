"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  Eye,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";

const initialBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    librarian: "John Doe",
    status: "published",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    librarian: "Jane Smith",
    status: "pending",
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    librarian: "Alex Johnson",
    status: "unpublished",
  },
  {
    id: 4,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    librarian: "John Doe",
    status: "rejected",
  },
];

const statusConfig = {
  published: {
    label: "Published",
    className: "badge-success",
  },
  pending: {
    label: "Pending",
    className: "badge-warning",
  },
  unpublished: {
    label: "Unpublished",
    className: "badge-neutral",
  },
  rejected: {
    label: "Rejected",
    className: "badge-error",
  },
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        book.librarian.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "all" || book.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [books, search, status]);

  const updateStatus = (id, newStatus) => {
    setBooks((current) =>
      current.map((book) =>
        book.id === id
          ? { ...book, status: newStatus }
          : book
      )
    );
  };

  const deleteBook = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this book?"
    );

    if (!confirmed) return;

    setBooks((current) =>
      current.filter((book) => book.id !== id)
    );
  };

  return (
    <main className="min-h-screen bg-base-200 p-4 md:p-8">

      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div>

          <div className="mb-2 flex items-center gap-2 text-primary">

            <BookOpen size={24} />

            <span className="font-medium">
              Bookora Admin
            </span>

          </div>

          <h1 className="text-3xl font-bold">
            All Books
          </h1>

          <p className="mt-1 text-base-content/60">
            Manage every book available in the Bookora system.
          </p>

        </div>

        {/* Toolbar */}
        <div className="card border border-base-300 bg-base-100 shadow-sm">

          <div className="flex flex-col gap-3 p-4 lg:flex-row">

            <label className="input input-bordered flex w-full items-center gap-2">

              <Search size={18} className="opacity-50" />

              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="grow"
              />

            </label>

            <select
              className="select select-bordered w-full lg:w-56"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="published">
                Published
              </option>

              <option value="pending">
                Pending
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

        {/* Books */}
        <div className="card border border-base-300 bg-base-100 shadow-sm">

          <div className="overflow-x-auto">

            <table className="table">

              <thead>
                <tr>

                  <th>Book</th>

                  <th>Category</th>

                  <th>Librarian</th>

                  <th>Status</th>

                  <th className="text-right">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredBooks.map((book) => (

                  <tr key={book.id}>

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
                      {book.librarian}
                    </td>

                    <td>
                      <StatusBadge status={book.status} />
                    </td>

                    <td>

                      <div className="flex justify-end gap-1">

                        <Link
                          href={`/admin/books/${book.id}`}
                          className="btn btn-ghost btn-sm"
                          title="View"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="btn btn-ghost btn-sm"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </Link>

                        {book.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(
                                  book.id,
                                  "published"
                                )
                              }
                              className="btn btn-success btn-sm"
                              title="Approve"
                            >
                              <Check size={17} />
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  book.id,
                                  "rejected"
                                )
                              }
                              className="btn btn-error btn-outline btn-sm"
                              title="Reject"
                            >
                              <X size={17} />
                            </button>
                          </>
                        )}

                        {book.status === "published" && (
                          <button
                            onClick={() =>
                              updateStatus(
                                book.id,
                                "unpublished"
                              )
                            }
                            className="btn btn-warning btn-outline btn-sm"
                            title="Unpublish"
                          >
                            Unpublish
                          </button>
                        )}

                        {book.status === "unpublished" && (
                          <button
                            onClick={() =>
                              updateStatus(
                                book.id,
                                "published"
                              )
                            }
                            className="btn btn-success btn-outline btn-sm"
                            title="Publish"
                          >
                            Publish
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteBook(book.id)
                          }
                          className="btn btn-ghost btn-sm text-error"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredBooks.length === 0 && (
              <div className="p-16 text-center">

                <BookOpen
                  size={35}
                  className="mx-auto opacity-30"
                />

                <h3 className="mt-4 text-lg font-semibold">
                  No books found
                </h3>

                <p className="text-sm text-base-content/60">
                  Try changing your search or status filter.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status];

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
}