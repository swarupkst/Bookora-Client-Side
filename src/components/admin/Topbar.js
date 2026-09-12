"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";

export default function Topbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-xl border border-zinc-200 p-2.5 text-zinc-700 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="hidden w-72 items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2.5 md:flex">
          <Search size={18} className="text-zinc-400" />
          <input
            placeholder="Search dashboard..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-xl border border-zinc-200 p-2.5 text-zinc-600 hover:bg-zinc-50">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <Link href="/dashboard/admin/profile" className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-zinc-50">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 font-bold text-violet-700">
            AD
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-sm font-bold text-zinc-800">Admin</div>
            <div className="text-xs text-zinc-400">Administrator</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
