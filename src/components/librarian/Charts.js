"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

export function Charts({ earnings = [], categories = [] }) {
    return (
        <div className="grid gap-5 xl:grid-cols-3">
            {/* Earnings Chart */}
            <section className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">
                <h2 className="font-bold">Earnings Overview</h2>

                <p className="text-xs text-slate-500">
                    Monthly delivery fee earnings
                </p>

                <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={earnings}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis dataKey="month" />

                            <YAxis />

                            <Tooltip
                                formatter={(value) => [
                                    `৳${Number(value).toLocaleString("en-BD")}`,
                                    "Earnings",
                                ]}
                            />

                            <Area
                                dataKey="amount"
                                type="monotone"
                                stroke="#5b4bdb"
                                fill="#ddd9ff"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Categories */}
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="font-bold">Inventory Categories</h2>

                <div className="mt-3 h-72">
                    {categories.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categories}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={85}
                                    label
                                >
                                    {categories.map((item, index) => (
                                        <Cell key={item._id || item.name || index} />
                                    ))}
                                </Pie>

                                <Legend />

                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            No category data available
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}