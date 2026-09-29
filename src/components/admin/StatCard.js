"use client";

import { useEffect, useState } from "react";
import {
  Users,
  LibraryBig,
  Truck,
  Banknote,
  TrendingUp,
} from "lucide-react";

const icons = {
  users: Users,
  books: LibraryBig,
  deliveries: Truck,
  revenue: Banknote,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StatCard({ item }) {
  const Icon = icons[item.type];

  const [value, setValue] = useState(item.value);

  const [loading, setLoading] = useState(
    item.type === "user" ||
      item.type === "books"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (item.type === "users") {
          const response = await fetch(
            `${API_URL}/api/dashboard/user`
          );

          if (!response.ok) {
            throw new Error(
              "Failed to fetch users"
            );
          }

          const result = await response.json();

          setValue(
            Array.isArray(result.data)
              ? result.data.length
              : 0
          );
        }

        if (item.type === "books") {
          const response = await fetch(
            `${API_URL}/api/dashboard/books`
          );

          if (!response.ok) {
            throw new Error(
              "Failed to fetch books"
            );
          }

          const result = await response.json();

          setValue(
            Array.isArray(result.data)
              ? result.data.length
              : 0
          );
        }
      } catch (error) {
        console.error(
          `Failed to fetch ${item.type}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (
      item.type === "users" ||
      item.type === "books"
    ) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [item.type]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700">
          <Icon size={21} />
        </div>

        {item.change && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
            <TrendingUp size={13} />
            {item.change}
          </span>
        )}
      </div>

      <p className="mt-5 text-sm font-medium text-zinc-500">
        {item.title}
      </p>

      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900">
        {loading ? "..." : value}
      </h3>
    </div>
  );
}