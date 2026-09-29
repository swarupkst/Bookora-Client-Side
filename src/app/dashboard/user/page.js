"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Clock3,
    Wallet,
    ArrowRight,
    Star,
    Truck,
    MessageSquare,
    ChevronRight,
} from "lucide-react";

import Shell from "@/components/user/Shell";
import StatusBadge from "@/components/user/StatusBadge";
import SpendingChart from "@/components/user/SpendingChart";

import {
    API_getCurrentUser,
    API_getDeliveries,
    API_getReviews,
    API_getMonthlySpending,
} from "@/data/Userdata";

export default function Page() {
    const [user, setUser] = useState(null);
    const [d, setD] = useState([]);
    const [r, setR] = useState([]);
    const [s, setS] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [u, deliveries, reviews, spending] =
                    await Promise.all([
                        API_getCurrentUser(),
                        API_getDeliveries(),
                        API_getReviews(),
                        API_getMonthlySpending(),
                    ]);

                setUser(u);
                setD(deliveries || []);
                setR(reviews || []);
                setS(spending || []);
            } catch (error) {
                console.error(
                    "Failed to load dashboard:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const getId = (item, index) =>
        item?._id || item?.id || `item-${index}`;

    const read = d.filter(
        (x) =>
            String(x.status).toLowerCase() ===
            "delivered"
    ).length;

    const pending = d.filter(
        (x) =>
            String(x.status).toLowerCase() !==
            "delivered"
    ).length;

    const spent = d.reduce(
        (total, x) =>
            total + Number(x.fee || 0),
        0
    );

    return (
        <Shell>
            <div className="mx-auto max-w-7xl space-y-7">
                {/* ================= HEADER ================= */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-600 p-6 text-white shadow-lg md:p-8">
                    <div className="relative z-10 max-w-2xl">
                        <p className="text-sm font-semibold text-violet-100">
                            Welcome back 👋
                        </p>

                        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                            {user?.name || "Reader"}
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100 md:text-base">
                            Keep track of your books, deliveries,
                            reviews and reading activity from one
                            place.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href="/browse"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-sm transition hover:bg-violet-50"
                            >
                                <BookOpen size={16} />
                                Browse Books
                            </Link>

                            <Link
                                href="/dashboard/user/deliveries"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                            >
                                My Deliveries
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Decorative shapes */}
                    <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
                    <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-white/5" />
                </section>

                {/* ================= STATS ================= */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Stat
                        title="Books Read"
                        value={loading ? "—" : read}
                        description="Successfully delivered"
                        icon={<BookOpen size={21} />}
                    />

                    <Stat
                        title="Pending Deliveries"
                        value={loading ? "—" : pending}
                        description="Currently in progress"
                        icon={<Clock3 size={21} />}
                    />

                    <Stat
                        title="Total Spent"
                        value={
                            loading
                                ? "—"
                                : `$${spent.toFixed(2)}`
                        }
                        description="Delivery spending"
                        icon={<Wallet size={21} />}
                    />
                </section>

                {/* ================= MAIN GRID ================= */}
                <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                    {/* Spending Chart */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                        <Wallet size={18} />
                                    </div>

                                    <h2 className="font-black text-zinc-900">
                                        Spending Overview
                                    </h2>
                                </div>

                                <p className="mt-2 text-xs text-zinc-500">
                                    Your monthly delivery spending
                                </p>
                            </div>

                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">
                                Monthly
                            </span>
                        </div>

                        <div className="mt-6">
                            {loading ? (
                                <div className="flex h-64 items-center justify-center text-sm text-zinc-400">
                                    Loading spending data...
                                </div>
                            ) : (
                                <SpendingChart data={s} />
                            )}
                        </div>
                    </div>

                    {/* Recent Deliveries */}
                    <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-zinc-100 p-5 md:p-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                        <Truck size={18} />
                                    </div>

                                    <h2 className="font-black text-zinc-900">
                                        Recent Deliveries
                                    </h2>
                                </div>

                                <p className="mt-2 text-xs text-zinc-500">
                                    Your latest delivery requests
                                </p>
                            </div>

                            <Link
                                href="/dashboard/user/deliveries"
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-violet-50 hover:text-violet-600"
                                aria-label="View all deliveries"
                            >
                                <ChevronRight size={19} />
                            </Link>
                        </div>

                        <div className="p-4 md:p-5">
                            {d.length === 0 ? (
                                <EmptyState
                                    icon={
                                        <Truck size={20} />
                                    }
                                    text="No deliveries yet."
                                />
                            ) : (
                                <div className="space-y-2">
                                    {d
                                        .slice(0, 4)
                                        .map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    key={getId(
                                                        item,
                                                        index
                                                    )}
                                                    className="group flex items-center justify-between gap-3 rounded-2xl border border-transparent bg-zinc-50 p-3.5 transition hover:border-violet-100 hover:bg-violet-50/50"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                                                            <BookOpen
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-bold text-zinc-800">
                                                                {item.bookTitle ||
                                                                    "Untitled Book"}
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-zinc-400">
                                                                {item.date ||
                                                                    (item.createdAt
                                                                        ? new Date(
                                                                              item.createdAt
                                                                          ).toLocaleDateString()
                                                                        : "No date")}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <StatusBadge
                                                        status={
                                                            item.status
                                                        }
                                                    />
                                                </div>
                                            )
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ================= REVIEWS ================= */}
                <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                                    <MessageSquare size={18} />
                                </div>

                                <h2 className="font-black text-zinc-900">
                                    My Reviews
                                </h2>
                            </div>

                            <p className="mt-2 text-xs text-zinc-500">
                                Your reviews for successfully
                                delivered books
                            </p>
                        </div>

                        <Link
                            href="/dashboard/user/reviews"
                            className="btn-soft inline-flex w-fit items-center gap-2"
                        >
                            Manage Reviews
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="divide-y divide-zinc-100">
                        {r.length === 0 ? (
                            <div className="p-8">
                                <EmptyState
                                    icon={
                                        <MessageSquare size={20} />
                                    }
                                    text="You haven't written any reviews yet."
                                />
                            </div>
                        ) : (
                            r.slice(0, 3).map(
                                (item, index) => (
                                    <div
                                        key={getId(
                                            item,
                                            index
                                        )}
                                        className="p-5 transition hover:bg-zinc-50/60 md:p-6"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="font-black text-zinc-900">
                                                    {item.bookTitle ||
                                                        "Untitled Book"}
                                                </p>

                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                                                    {item.comment ||
                                                        "No comment added."}
                                                </p>

                                                <p className="mt-2 text-xs text-zinc-400">
                                                    {item.date ||
                                                        (item.createdAt
                                                            ? new Date(
                                                                  item.createdAt
                                                              ).toLocaleDateString()
                                                            : "No date")}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1 rounded-xl bg-yellow-50 px-3 py-2">
                                                {Array.from({
                                                    length: 5,
                                                }).map(
                                                    (
                                                        _,
                                                        i
                                                    ) => (
                                                        <Star
                                                            key={
                                                                i
                                                            }
                                                            size={
                                                                14
                                                            }
                                                            className={
                                                                i <
                                                                Number(
                                                                    item.rating
                                                                )
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-zinc-300"
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </section>
            </div>
        </Shell>
    );
}

/* ================= STAT CARD ================= */

function Stat({
    title,
    value,
    description,
    icon,
}) {
    return (
        <div className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-tight text-zinc-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                        {description}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">
                    {icon}
                </div>
            </div>
        </div>
    );
}

/* ================= EMPTY STATE ================= */

function EmptyState({ icon, text }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                {icon}
            </div>

            <p className="mt-3 text-sm font-semibold text-zinc-500">
                {text}
            </p>
        </div>
    );
}