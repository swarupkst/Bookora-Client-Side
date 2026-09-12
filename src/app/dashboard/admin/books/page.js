"use client";

import { useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { initialBooks } from "@/data/adminData";
import { Search, Trash2 } from "lucide-react";

export default function BooksPage() {
  const [books, setBooks] = useState(initialBooks);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      books.filter((book) =>
        `${book.title} ${book.librarian} ${book.category}`.toLowerCase().includes(query.toLowerCase())
      ),
    [books, query]
  );

  function toggleStatus(id) {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id
          ? { ...book, status: book.status === "Published" ? "Unpublished" : "Published" }
          : book
      )
    );
  }

  function remove(id) {
    if (confirm("Permanently delete this book?")) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    }
  }

  return (
    <AdminShell title="Manage All Books" subtitle="Control every book listing on BookOra.">
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
        <Search size={18} className="text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-left">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3">Book</th>
                <th className="px-5 py-3">Librarian</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} className="border-t border-zinc-100 text-sm">
                  <td className="px-5 py-4 font-bold text-zinc-900">{book.title}</td>
                  <td className="px-5 py-4 text-zinc-600">{book.librarian}</td>
                  <td className="px-5 py-4 text-zinc-600">{book.category}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        book.status === "Published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(book.id)}
                        className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700"
                      >
                        {book.status === "Published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => remove(book.id)}
                        className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
