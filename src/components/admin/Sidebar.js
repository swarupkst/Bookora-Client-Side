"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpenCheck,
  LibraryBig,
  Users,
  CreditCard,
  UserRound,
  LogOut,
  X,
} from "lucide-react";

const links = [
  {
    href: "/dashboard/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/admin/approvals",
    label: "Book Approval",
    icon: BookOpenCheck,
  },
  {
    href: "/dashboard/admin/books",
    label: "All Books",
    icon: LibraryBig,
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/dashboard/admin/transactions",
    label: "Transactions",
    icon: CreditCard,
  },
  {
    href: "/dashboard/admin/profile",
    label: "Profile",
    icon: UserRound,
  },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          bg-transparent
          transition-transform duration-300

          lg:translate-x-0

          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-between px-6">
          
          <div className="text-lg font-bold text-zinc-900 lg:hidden">
            Admin Panel
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-2 text-zinc-700 hover:bg-zinc-200/50 lg:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Management
          </p>

          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              const isOverview =
                link.href === "/dashboard/admin";

              const active = isOverview
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3
                    rounded-xl px-3 py-3
                    text-sm font-semibold
                    transition

                    ${
                      active
                        ? "bg-violet-100/70 text-violet-700"
                        : "text-zinc-600 hover:bg-zinc-200/40 hover:text-zinc-900"
                    }
                  `}
                >
                  <Icon size={19} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

      </aside>
    </>
  );
}