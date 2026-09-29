"use client";

import { useEffect, useState } from "react";
import {
    Wallet,
    TrendingUp,
    Clock3,
    Loader2,
} from "lucide-react";

import Shell from "@/components/librarian/Shell";
import { Charts } from "@/components/librarian/Charts";
import { API_getEarnings } from "@/data/data";

const DEMO_EARNINGS = {
    totalEarnings: 0,
    thisMonth: 0,
    pendingEarnings: 0,
};

export default function Earnings() {
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEarnings = async () => {
            try {
                const data = await API_getEarnings();

                // Backend data available হলে সেটাই ব্যবহার করবে
                if (data) {
                    setEarnings(data);
                } else {
                    // Temporary demo data
                    setEarnings(DEMO_EARNINGS);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch earnings:",
                    error
                );

                // Temporary fallback data
                setEarnings(DEMO_EARNINGS);
            } finally {
                setLoading(false);
            }
        };

        loadEarnings();
    }, []);

    const stats = [
        {
            title: "Total Earnings",
            value: earnings?.totalEarnings ?? 0,
            description: "All-time delivery fees",
            icon: <Wallet size={21} />,
        },
        {
            title: "This Month",
            value: earnings?.thisMonth ?? 0,
            description: "Earnings this month",
            icon: <TrendingUp size={21} />,
        },
        {
            title: "Pending Earnings",
            value: earnings?.pendingEarnings ?? 0,
            description: "Awaiting completion",
            icon: <Clock3 size={21} />,
        },
    ];

    return (
        <Shell>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-7">
                    <p className="text-sm font-semibold text-violet-600">
                        Financial Overview
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Earnings
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Track your delivery-fee earnings and
                        payment activity.
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    {stats.map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {item.title}
                                    </p>

                                    {loading ? (
                                        <div className="mt-3 flex items-center gap-2 text-slate-400">
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                            <span className="text-sm">
                                                Loading...
                                            </span>
                                        </div>
                                    ) : (
                                        <b className="mt-2 block text-2xl font-black text-slate-900">
                                            ৳
                                            {Number(
                                                item.value || 0
                                            ).toLocaleString(
                                                "en-BD"
                                            )}
                                        </b>
                                    )}

                                    <p className="mt-1 text-xs text-slate-400">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">
                                    {item.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-black text-slate-900">
                            Earnings Overview
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Monthly delivery-fee earnings
                        </p>
                    </div>

                    <Charts />
                </div>
            </div>
        </Shell>
    );
}