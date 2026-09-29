"use client";

import { useEffect, useState } from "react";
import Shell from "@/components/user/Shell";
import StatusBadge from "@/components/user/StatusBadge";
import { API_getDeliveries } from "@/data/Userdata";

export default function Page() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDeliveries = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await API_getDeliveries();

                setDeliveries(data);
            } catch (err) {
                console.error("Failed to load deliveries:", err);
                setError("Failed to load delivery data.");
            } finally {
                setLoading(false);
            }
        };

        loadDeliveries();
    }, []);

    return (
        <Shell>
            <div className="mx-auto max-w-7xl">
                <h2 className="text-2xl font-black">
                    My Deliveries
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Track all your book delivery requests.
                </p>

                <div className="card mt-6 overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                            <tr>
                                <th className="p-4">Delivery ID</th>
                                <th className="p-4">Book</th>
                                <th className="p-4">Librarian</th>
                                <th className="p-4">Fee</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
    {loading ? (
        <tr>
            <td
                colSpan="6"
                className="p-8 text-center text-zinc-500"
            >
                Loading deliveries...
            </td>
        </tr>
    ) : error ? (
        <tr>
            <td
                colSpan="6"
                className="p-8 text-center text-red-500"
            >
                {error}
            </td>
        </tr>
    ) : deliveries.length === 0 ? (
        <tr>
            <td
                colSpan="6"
                className="p-8 text-center text-zinc-500"
            >
                No delivery requests found.
            </td>
        </tr>
    ) : (
        deliveries.map((delivery, index) => (
            <tr
                key={
                    delivery._id ||
                    delivery.id ||
                    `delivery-${index}`
                }
                className="hover:bg-zinc-50/50"
            >
                <td className="p-4 font-bold">
                    {delivery._id || delivery.id}
                </td>

                <td className="p-4">
                    <p className="font-bold">
                        {delivery.bookTitle}
                    </p>

                    <p className="text-xs text-zinc-500">
                        {delivery.author}
                    </p>
                </td>

                <td className="p-4">
                    {delivery.librarian || "—"}
                </td>

                <td className="p-4 font-medium">
                    ${Number(delivery.fee || 0).toFixed(2)}
                </td>

                <td className="p-4">
                    {delivery.createdAt
                        ? new Date(
                              delivery.createdAt
                          ).toLocaleDateString()
                        : "—"}
                </td>

                <td className="p-4">
                    <StatusBadge
                        status={delivery.status}
                    />
                </td>
            </tr>
        ))
    )}
</tbody>
                    </table>
                </div>
            </div>
        </Shell>
    );
}