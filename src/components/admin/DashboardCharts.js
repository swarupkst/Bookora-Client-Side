"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { categoryData, revenueData } from "@/data/adminData";

const pieColors = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export default function DashboardCharts() {
  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm xl:col-span-3">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-zinc-900">Revenue Overview</h2>
          <p className="text-sm text-zinc-500">Dummy monthly delivery-fee revenue</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="bookoraRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`৳${value}`, "Revenue"]} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={3}
                fill="url(#bookoraRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-zinc-900">Books by Category</h2>
          <p className="text-sm text-zinc-500">Current dummy inventory distribution</p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={3}
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {categoryData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-xs text-zinc-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: pieColors[index % pieColors.length] }}
              />
              {item.name}: {item.value}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
