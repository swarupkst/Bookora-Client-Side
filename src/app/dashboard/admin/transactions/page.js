"use client";

import { useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { transactions } from "@/data/adminData";
import { Search } from "lucide-react";

export default function TransactionsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      transactions.filter((tx) =>
        `${tx.id} ${tx.user} ${tx.librarian}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <AdminShell
      title="All Transactions"
      subtitle="View delivery-fee transactions across the platform."
    >
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
        <Search size={18} className="text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transaction..."
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full text-left">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3">Transaction ID</th>
                <th className="px-5 py-3">User Email</th>
                <th className="px-5 py-3">Librarian Email</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-t border-zinc-100 text-sm">
                  <td className="px-5 py-4 font-bold text-zinc-900">{tx.id}</td>
                  <td className="px-5 py-4 text-zinc-600">{tx.user}</td>
                  <td className="px-5 py-4 text-zinc-600">{tx.librarian}</td>
                  <td className="px-5 py-4 font-semibold">৳{tx.amount}</td>
                  <td className="px-5 py-4 text-zinc-500">{tx.date}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      {tx.status}
                    </span>
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
