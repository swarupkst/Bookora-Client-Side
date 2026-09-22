"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Clock3,
    Wallet,
    ArrowRight,
    Star,
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

    useEffect(() => {
        Promise.all([
            API_getCurrentUser(),
            API_getDeliveries(),
            API_getReviews(),
            API_getMonthlySpending(),
        ]).then(([u, a, b, c]) => {
            setUser(u);
            setD(a);
            setR(b);
            setS(c);
        });
    }, []);

    const read = d.filter(
        (x) => x.status === "Delivered"
    ).length;

    const pending = d.filter(
        (x) => x.status !== "Delivered"
    ).length;

    const spent = d.reduce(
        (a, x) => a + Number(x.fee || 0),
        0
    );

    return (
        <Shell>
            <div className="mx-auto max-w-7xl space-y-6">
                <section>
                    <p className="text-sm font-semibold text-violet-600">
                        Welcome back
                    </p>

                    <h2 className="mt-1 text-2xl font-black md:text-3xl">
                        {user?.name || "Reader"} 👋
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        Here is what is happening with your BookOra account.
                    </p>
                </section>

                <div className="grid gap-4 md:grid-cols-3">
                    <Stat
                        t="Total Books Read"
                        v={read}
                        i={<BookOpen />}
                    />

                    <Stat
                        t="Pending Deliveries"
                        v={pending}
                        i={<Clock3 />}
                    />

                    <Stat
                        t="Total Spent"
                        v={`৳${spent}`}
                        i={<Wallet />}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                    <section className="card p-5">
                        <div className="mb-4 flex justify-between">
                            <div>
                                <h3 className="font-bold">
                                    Monthly Delivery Spending
                                </h3>

                                <p className="text-xs text-zinc-500">
                                    Loaded through the API data layer
                                </p>
                            </div>

                            <Wallet className="text-violet-600" />
                        </div>

                        <SpendingChart data={s} />
                    </section>

                    <section className="card p-5">
                        <div className="mb-4 flex justify-between">
                            <h3 className="font-bold">
                                Recent Deliveries
                            </h3>

                            <Link
                                href="/dashboard/user/deliveries"
                                className="text-xs font-bold text-violet-600"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {d.slice(0, 4).map((x) => (
                                <div
                                    key={x.id}
                                    className="flex items-center justify-between rounded-xl bg-zinc-50 p-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold">
                                            {x.bookTitle}
                                        </p>

                                        <p className="text-xs text-zinc-500">
                                            {x.date}
                                        </p>
                                    </div>

                                    <StatusBadge status={x.status} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section className="card overflow-hidden">
                    <div className="flex items-center justify-between border-b p-5">
                        <div>
                            <h3 className="font-bold">
                                My Reviews
                            </h3>

                            <p className="text-xs text-zinc-500">
                                Reviews from successfully delivered books
                            </p>
                        </div>

                        <Link
                            href="/dashboard/user/reviews"
                            className="btn-soft"
                        >
                            Manage
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="divide-y">
                        {r.slice(0, 3).map((x) => (
                            <div
                                key={x.id}
                                className="flex flex-col gap-2 p-5 sm:flex-row sm:justify-between"
                            >
                                <div>
                                    <p className="font-bold">
                                        {x.bookTitle}
                                    </p>

                                    <p className="text-sm text-zinc-500">
                                        {x.comment}
                                    </p>
                                </div>

                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                size={15}
                                                className={
                                                    i < x.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-zinc-300"
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Shell>
    );
}

function Stat({ t, v, i }) {
    return (
        <div className="card flex items-center justify-between p-5">
            <div>
                <p className="text-sm text-zinc-500">
                    {t}
                </p>

                <p className="mt-1 text-3xl font-black">
                    {v}
                </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
                {i}
            </div>
        </div>
    );
}