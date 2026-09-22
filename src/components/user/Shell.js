"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
    LayoutDashboard,
    BookOpen,
    Truck,
    Heart,
    Star,
    UserCircle,
    Menu,
    X,
    Library,
} from "lucide-react";

const nav = [
    ["/dashboard/user", "Dashboard", LayoutDashboard],
    ["/browse", "Browse Books", BookOpen],
    ["/dashboard/user/deliveries", "My Deliveries", Truck],
    ["/dashboard/user/reading-list", "Reading List", Heart],
    ["/dashboard/user/reviews", "My Reviews", Star],
    ["/dashboard/user/profile", "Profile", UserCircle],
];

export default function Shell({ children }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Mobile Overlay */}
            {open && (
                <button
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    aria-label="Close sidebar"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 border-none border-zinc-200 bg-transparent backdrop-blur-xl transition-transform lg:translate-x-0 ${
                    open
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="flex h-18 items-center justify-between border-b border-zinc-200 px-6">
                    {/* <Link
                        href="/dashboard/user"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-xl font-black text-violet-700"
                    >
                        <Library size={25} />
                        BookOra
                    </Link>

                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button> */}
                </div>

                {/* Navigation */}
                <nav className="space-y-1 p-4">
                    {nav.map(([href, label, Icon]) => {
                        const active =
                            pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() =>
                                    setOpen(false)
                                }
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                    active
                                        ? "bg-violet-600 text-white shadow-sm"
                                        : "text-zinc-600 hover:bg-violet-50 hover:text-violet-700"
                                }`}
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
                {/* Mobile Top Bar Only */}
                <header className="flex h-16 items-center border-b border-zinc-200 bg-transparent px-4 md:px-8 lg:hidden">
                    <button
                        className="rounded-xl p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                        onClick={() => setOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={23} />
                    </button>
                </header>

                {/* Page Content */}
                <main className="min-h-screen bg-transparent p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}