"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

const initialBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    status: "published",
    copies: 12,
    available: 8,
    updatedAt: "Aug 24, 2026",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    status: "pending",
    copies: 10,
    available: 10,
    updatedAt: "Aug 23, 2026",
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    status: "unpublished",
    copies: 5,
    available: 5,
    updatedAt: "Aug 21, 2026",
  },
  {
    id: 4,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    status: "published",
    copies: 15,
    available: 11,
    updatedAt: "Aug 20, 2026",
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

export default function LibrarianBooksPage() {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        book.category.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "all" || book.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [books, search, status]);

  const handleUnpublish = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to unpublish this book?"
    );

    if (!confirmed) return;

    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === id
          ? { ...book, status: "unpublished" }
          : book
      )
    );
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    setBooks((currentBooks) =>
      currentBooks.filter((book) => book.id !== id)
    );
  };

  const totalBooks = books.length;

  const publishedBooks = books.filter(
    (book) => book.status === "published"
  ).length;

  const pendingBooks = books.filter(
    (book) => book.status === "pending"
  ).length;

  const unpublishedBooks = books.filter(
    (book) => book.status === "unpublished"
  ).length;

  return (
    <main className="min-h-screen bg-base-200 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="text-primary" size={26} />

              <span className="text-sm font-medium text-primary">
                Bookora Librarian
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Book Inventory
            </h1>

            <p className="mt-1 text-base-content/60">
              Manage the books you have added to Bookora.
            </p>
          </div>

          <Link
            href="/librarian/books/add"
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add New Book
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Books"
            value={totalBooks}
            icon={<BookOpen size={22} />}
          />

          <StatCard
            title="Published"
            value={publishedBooks}
            icon={<CheckCircle2 size={22} />}
          />

          <StatCard
            title="Pending"
            value={pendingBooks}
            icon={<Clock3 size={22} />}
          />

          <StatCard
            title="Unpublished"
            value={unpublishedBooks}
            icon={<XCircle size={22} />}
          />

        </div>

        {/* Main Card */}
        <div className="card border border-base-300 bg-base-100 shadow-sm">

          {/* Toolbar */}
          <div className="border-b border-base-300 p-4">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              {/* Search */}
              <label className="input input-bordered flex w-full items-center gap-2 lg:max-w-md">
                <Search size={18} className="opacity-50" />

                <input
                  type="text"
                  placeholder="Search by title, author or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="grow"
                />
              </label>

              {/* Filter */}
              <select
                className="select select-bordered w-full lg:w-52"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="unpublished">Unpublished</option>
                <option value="rejected">Rejected</option>
              </select>

            </div>

          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">

            <table className="table">

              <thead>
                <tr>
                  <th>Book</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Copies</th>
                  <th>Available</th>
                  <th>Updated</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredBooks.map((book) => (
                  <tr key={book.id}>

                    <td>
                      <div>
                        <div className="font-semibold">
                          {book.title}
                        </div>

                        <div className="text-sm text-base-content/60">
                          {book.author}
                        </div>
                      </div>
                    </td>

                    <td>
                      {book.category}
                    </td>

                    <td>
                      <StatusBadge status={book.status} />
                    </td>

                    <td>
                      {book.copies}
                    </td>

                    <td>
                      {book.available}
                    </td>

                    <td>
                      <span className="text-sm text-base-content/60">
                        {book.updatedAt}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-end gap-1">

                        <Link
                          href={`/books/${book.id}`}
                          className="btn btn-ghost btn-sm"
                          title="View"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          href={`/librarian/books/${book.id}/edit`}
                          className="btn btn-ghost btn-sm"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </Link>

                        {book.status === "published" && (
                          <button
                            onClick={() =>
                              handleUnpublish(book.id)
                            }
                            className="btn btn-ghost btn-sm text-warning"
                            title="Unpublish"
                          >
                            <XCircle size={17} />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(book.id)
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
              <EmptyState />
            )}

          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden">

            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-xl border border-base-300 p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h3 className="font-semibold">
                      {book.title}
                    </h3>

                    <p className="text-sm text-base-content/60">
                      {book.author}
                    </p>
                  </div>

                  <StatusBadge status={book.status} />

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                  <div>
                    <p className="text-base-content/50">
                      Category
                    </p>

                    <p className="font-medium">
                      {book.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-base-content/50">
                      Copies
                    </p>

                    <p className="font-medium">
                      {book.copies}
                    </p>
                  </div>

                  <div>
                    <p className="text-base-content/50">
                      Available
                    </p>

                    <p className="font-medium">
                      {book.available}
                    </p>
                  </div>

                  <div>
                    <p className="text-base-content/50">
                      Updated
                    </p>

                    <p className="font-medium">
                      {book.updatedAt}
                    </p>
                  </div>

                </div>

                <div className="mt-4 flex gap-2">

                  <Link
                    href={`/books/${book.id}`}
                    className="btn btn-sm flex-1"
                  >
                    <Eye size={16} />
                    View
                  </Link>

                  <Link
                    href={`/librarian/books/${book.id}/edit`}
                    className="btn btn-sm flex-1"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(book.id)
                    }
                    className="btn btn-error btn-outline btn-sm"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            ))}

            {filteredBooks.length === 0 && (
              <EmptyState />
            )}

          </div>

        </div>

      </div>
    </main>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">

      <div className="card-body p-5">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-base-content/60">
              {title}
            </p>

            <p className="mt-1 text-2xl font-bold">
              {value}
            </p>
          </div>

          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            {icon}
          </div>

        </div>

      </div>

    </div>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status];

  if (!config) return null;

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

      <div className="rounded-full bg-base-200 p-4">
        <BookOpen
          size={30}
          className="text-base-content/40"
        />
      </div>

      <h3 className="mt-4 text-lg font-semibold">
        No books found
      </h3>

      <p className="mt-1 max-w-md text-sm text-base-content/60">
        Try changing your search or filter to find books.
      </p>

    </div>
  );
}