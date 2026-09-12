import AdminShell from "@/components/admin/AdminShell";
import DashboardCharts from "@/components/admin/DashboardCharts";
import RecentTransactions from "@/components/admin/RecentTransactions";
import StatCard from "@/components/admin/StatCard";
import { stats } from "@/data/adminData";
import Sidebar from "@/components/admin/Sidebar";
import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <AdminShell
      title="Admin Overview"
      subtitle="Monitor BookOra users, books, deliveries, approvals and revenue."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} item={item} />
        ))}
      </div>

      <div className="mt-6">
        <DashboardCharts />
      </div>

      <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-violet-700">
              <BookOpenCheck size={21} />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">3 books are waiting for approval</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Review pending librarian submissions before publishing them.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/approvals"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
          >
            Review books <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <RecentTransactions />
      </div>
      
    </AdminShell>
  );
}
