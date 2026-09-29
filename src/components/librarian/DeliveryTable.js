"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DeliveryTable() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    // ===============================
    // Fetch Deliveries
    // ===============================
    const fetchDeliveries = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/deliveries`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch deliveries: ${response.status}`
                );
            }

            const result = await response.json();

            setRows(result?.data || []);
        } catch (error) {
            console.error(
                "Failed to fetch deliveries:",
                error
            );

            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    // ===============================
    // Update Delivery Status
    // ===============================
    const update = async (id, status) => {
        try {
            setUpdatingId(id);

            const response = await fetch(
                `${API_URL}/api/deliveries/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to update delivery: ${response.status}`
                );
            }

            const result = await response.json();

            const updatedDelivery = result?.data;

            if (updatedDelivery) {
                setRows((currentRows) =>
                    currentRows.map((row) =>
                        String(row._id || row.id) === String(id)
                            ? updatedDelivery
                            : row
                    )
                );
            } else {
                setRows((currentRows) =>
                    currentRows.map((row) =>
                        String(row._id || row.id) === String(id)
                            ? {
                                ...row,
                                status,
                            }
                            : row
                    )
                );
            }
        } catch (error) {
            console.error(
                "Failed to update delivery:",
                error
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* Header */}
            <div className="border-b p-5">
                <h2 className="font-bold">
                    Manage Deliveries
                </h2>

                <p className="text-xs text-slate-500">
                    Pending → Dispatched → Delivered
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="p-4">
                                User
                            </th>

                            <th>
                                Book
                            </th>

                            <th>
                                Fee
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-10 text-center"
                                >
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Loading deliveries...
                                    </div>
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-10 text-center text-sm text-slate-500"
                                >
                                    No deliveries found.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, index) => {
                                const id =
                                    r._id ||
                                    r.id ||
                                    index;

                                return (
                                    <tr key={id}>
                                        {/* User */}
                                        <td className="p-4">
                                            <b>
                                                {r.user ||
                                                    r.userName ||
                                                    "Unknown User"}
                                            </b>

                                            <p className="text-xs text-slate-500">
                                                {r.email ||
                                                    r.userEmail ||
                                                    "—"}
                                            </p>
                                        </td>

                                        {/* Book */}
                                        <td>
                                            {r.book ||
                                                r.bookTitle ||
                                                "Unknown Book"}
                                        </td>

                                        {/* Fee */}
                                        <td>
                                            ৳
                                            {Number(
                                                r.amount ??
                                                r.fee ??
                                                0
                                            ).toLocaleString(
                                                "en-BD"
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td>
                                            <span
                                                className={
                                                    "rounded-full px-2.5 py-1 text-xs font-bold " +
                                                    (
                                                        r.status ===
                                                        "Delivered"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : r.status ===
                                                                "Dispatched"
                                                                ? "bg-blue-50 text-blue-700"
                                                                : "bg-amber-50 text-amber-700"
                                                    )
                                                }
                                            >
                                                {r.status ||
                                                    "Pending"}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td>
                                            {r.status ===
                                                "Pending" && (
                                                    <button
                                                        disabled={
                                                            updatingId ===
                                                            id
                                                        }
                                                        onClick={() =>
                                                            update(
                                                                id,
                                                                "Dispatched"
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-lg bg-[#5b4bdb] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#4d3fc2] disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {updatingId ===
                                                            id ? (
                                                            <>
                                                                <Loader2
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="animate-spin"
                                                                />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            "Dispatch"
                                                        )}
                                                    </button>
                                                )}

                                            {r.status ===
                                                "Dispatched" && (
                                                    <button
                                                        disabled={
                                                            updatingId ===
                                                            id
                                                        }
                                                        onClick={() =>
                                                            update(
                                                                id,
                                                                "Delivered"
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {updatingId ===
                                                            id ? (
                                                            <>
                                                                <Loader2
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="animate-spin"
                                                                />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            "Mark Delivered"
                                                        )}
                                                    </button>
                                                )}

                                            {r.status ===
                                                "Delivered" && (
                                                    <span className="text-xs font-bold text-emerald-600">
                                                        Completed
                                                    </span>
                                                )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}