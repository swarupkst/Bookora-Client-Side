"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Truck,
  Wallet,
  UserCircle,
} from "lucide-react";

const nav = [
  ["Dashboard", "/dashboard/librarian", LayoutDashboard],
  ["Add Book", "/dashboard/librarian/add-book", PlusCircle],
  ["Manage Inventory", "/dashboard/librarian/inventory", BookOpen],
  ["Manage Deliveries", "/dashboard/librarian/deliveries", Truck],
  ["Earnings", "/dashboard/librarian/earnings", Wallet],
  ["Profile", "/dashboard/librarian/profile", UserCircle],
];

export default function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <div className="min-h-screen bg-transparent">

      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={
          "fixed left-0 top-0 z-50 h-screen w-72 " +
          " border-slate-200/50 bg-transparent p-5 " +
          "transition-transform duration-300 " +
          (open ? "translate-x-0" : "-translate-x-full") +
          " lg:translate-x-0"
        }
      >

        {/* Header */}
        <div className="flex items-center justify-between px-2 pb-8">


          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-200/40 lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* Panel Title */}
        <p className="px-3 mt-8 pb-3 text-xs font-bold uppercase text-slate-400">
          Librarian Panel
        </p>

        {/* Navigation */}
        <nav className="space-y-1">

          {nav.map(([label, href, Icon]) => {
            const active = path === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={
                  "flex items-center gap-3 rounded-xl px-4 py-3 " +
                  "text-sm font-bold transition " +
                  (active
                    ? "bg-[#5b4bdb] text-white"
                    : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-900")
                }
              >
                <Icon size={19} />
                {label}
              </Link>
            );
          })}

        </nav>

      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">

        <main className="mx-auto max-w-[1500px] p-4 md:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}