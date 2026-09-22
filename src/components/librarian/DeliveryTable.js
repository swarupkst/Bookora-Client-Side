'use client';
import { useState } from "react";
import { deliveries as initial } from "@/data/data";
export default function DeliveryTable() {
    const [rows, setRows] = useState(initial);
    const update = (id, status) => setRows(rows.map(r => r.id === id ? { ...r, status } : r));
    return <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5">
            <h2 className="font-bold">Manage Deliveries</h2>
            <p className="text-xs text-slate-500">Pending → Dispatched → Delivered</p>
        </div><div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr><th className="p-4">User</th>
                        <th>Book</th>
                        <th>Fee</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">{rows.map(r => <tr key={r.id}>
                    <td className="p-4">
                        <b>{r.user}</b>
                        <p className="text-xs text-slate-500">{r.email}</p>
                    </td>
                    <td>{r.book}</td>
                    <td>৳{r.amount}</td>
                    <td>
                        <span className={"rounded-full px-2.5 py-1 text-xs font-bold " + (r.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : r.status === "Dispatched" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700")}>{r.status}</span>
                    </td>
                    <td>{r.status === "Pending" &&
                        <button onClick={() => update(r.id, "Dispatched")} className="rounded-lg bg-[#5b4bdb] px-3 py-2 text-xs font-bold text-white">Dispatch
                        </button>}{r.status === "Dispatched" &&
                            <button onClick={() => update(r.id, "Delivered")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Mark Delivered
                            </button>}{r.status === "Delivered" &&
                                <span className="text-xs font-bold text-emerald-600">Completed</span>}
                    </td>
                </tr>)}
                </tbody>
            </table>
        </div>
    </section>
}