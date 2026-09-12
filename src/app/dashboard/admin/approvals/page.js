"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { pendingBooks } from "@/data/adminData";
import { Check, Search, Trash2 } from "lucide-react";

export default function ApprovalsPage() {
  const [books, setBooks] = useState(pendingBooks);
  const [query, setQuery] = useState("");

  const filtered = books.filter((book) =>
    `${book.title} ${book.author} ${book.librarian}`.toLowerCase().includes(query.toLowerCase())
  );

  function approve(id) {
    setBooks((prev) => prev.filter((book) => book.id !== id));
    alert("Book approved and published (demo).");
  }

  function remove(id) {
    if (confirm("Delete this pending book?")) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    }
  }

  return (
    <AdminShell
      title="Book Approval Queue"
      subtitle="Approve or remove books submitted by librarians."
    >
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
        <Search size={18} className="text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pending books..."
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3">Book</th>
                <th className="px-5 py-3">Librarian</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Fee</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} className="border-t border-zinc-100 text-sm">
                  <td className="px-5 py-4">
                    <div className="font-bold text-zinc-900">{book.title}</div>
                    <div className="text-xs text-zinc-500">{book.author}</div>
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{book.librarian}</td>
                  <td className="px-5 py-4 text-zinc-600">{book.category}</td>
                  <td className="px-5 py-4 font-semibold">৳{book.fee}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      {book.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => approve(book.id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                      >
                        <Check size={15} /> Approve
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-zinc-500">
                    No pending books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
