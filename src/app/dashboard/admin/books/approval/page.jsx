"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  Eye,
  X,
} from "lucide-react";

const initialPendingBooks = [
  {
    id: 101,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    librarian: "John Doe",
    submittedAt: "Aug 24, 2026",
  },
  {
    id: 102,
    title: "Clean Architecture",
    author: "Robert C. Martin",
    category: "Programming",
    librarian: "Jane Smith",
    submittedAt: "Aug 23, 2026",
  },
  {
    id: 103,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    librarian: "Alex Johnson",
    submittedAt: "Aug 22, 2026",
  },
];

export default function ApprovalQueuePage() {
  const [books, setBooks] = useState(initialPendingBooks);

  const handleApprove = (id) => {
    const confirmed = window.confirm(
      "Approve this book?"
    );

    if (!confirmed) return;

    setBooks((current) =>
      current.filter((book) => book.id !== id)
    );
  };

  const handleReject = (id) => {
    const confirmed = window.confirm(
      "Reject this book?"
    );

    if (!confirmed) return;

    setBooks((current) =>
      current.filter((book) => book.id !== id)
    );
  };

  return (
    <main className="min-h-screen bg-base-200 p-4 md:p-8">

      <div className="mx-auto max-w-7xl space-y-6">

        <div>

          <div className="mb-2 flex items-center gap-2 text-primary">
            <AlertCircle size={24} />

            <span className="font-medium">
              Bookora Admin
            </span>
          </div>

          <h1 className="text-3xl font-bold">
            Approval Queue
          </h1>

          <p className="mt-1 text-base-content/60">
            Review books submitted by librarians.
          </p>

        </div>

        <div className="alert border border-warning/30 bg-warning/10">

          <AlertCircle size={20} />

          <span>
            {books.length} book
            {books.length !== 1 ? "s are" : " is"} waiting
            for approval.
          </span>

        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">

          <div className="overflow-x-auto">

            <table className="table">

              <thead>
                <tr>
                  <th>Book</th>
                  <th>Category</th>
                  <th>Librarian</th>
                  <th>Submitted</th>
                  <th className="text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {books.map((book) => (
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
                      {book.submittedAt}
                    </td>

                    <td>

                      <div className="flex justify-end gap-2">

                        <Link
                          href={`/admin/books/${book.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          <Eye size={17} />
                          Review
                        </Link>

                        <button
                          onClick={() =>
                            handleApprove(book.id)
                          }
                          className="btn btn-success btn-sm"
                        >
                          <Check size={17} />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleReject(book.id)
                          }
                          className="btn btn-error btn-outline btn-sm"
                        >
                          <X size={17} />
                          Reject
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {books.length === 0 && (
              <div className="p-16 text-center">

                <div className="mx-auto w-fit rounded-full bg-success/10 p-4 text-success">
                  <Check size={30} />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                  All caught up!
                </h3>

                <p className="mt-1 text-sm text-base-content/60">
                  There are no books waiting for approval.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}