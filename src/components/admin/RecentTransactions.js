import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { transactions } from "@/data/adminData";

export default function RecentTransactions() {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 p-5">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Recent Transactions</h2>
          <p className="text-sm text-zinc-500">Latest delivery-fee payments</p>
        </div>

        <Link
          href="/dashboard/admin/transactions"
          className="flex items-center gap-1 text-sm font-bold text-violet-700"
        >
          View all <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-5 py-3">Transaction</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 4).map((tx) => (
              <tr key={tx.id} className="border-t border-zinc-100 text-sm">
                <td className="px-5 py-4 font-semibold text-zinc-800">{tx.id}</td>
                <td className="px-5 py-4 text-zinc-600">{tx.user}</td>
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
    </section>
  );
}
