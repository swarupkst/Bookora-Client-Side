'use client';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"; import { earnings, categories } from "@/data/data";
export function Charts() {
    return <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="font-bold">Earnings Overview</h2>
            <p className="text-xs text-slate-500">Monthly delivery fee earnings</p>
            <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earnings}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area dataKey="amount" type="monotone" stroke="#5b4bdb" fill="#ddd9ff" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-bold">Inventory Categories</h2>
            <div className="mt-3 h-72">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={categories} dataKey="value" nameKey="name" outerRadius={85} label>{categories.map((_, i) => <Cell key={i} />)}</Pie>
                        <Legend />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </section>
    </div>
}