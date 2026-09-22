"use client";

import { useEffect, useState } from "react";
import Shell from "@/components/user/Shell";
import StatusBadge from "@/components/user/StatusBadge";
import { API_getDeliveries } from "@/data/Userdata";

export default function Page() {
  const [x, setX] = useState([]);

  useEffect(() => {
    API_getDeliveries().then(setX);
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
              {x.map((a) => (
                <tr key={a.id}>
                  <td className="p-4 font-bold">
                    {a.id}
                  </td>

                  <td className="p-4">
                    <p className="font-bold">
                      {a.bookTitle}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {a.author}
                    </p>
                  </td>

                  <td className="p-4">
                    {a.librarian}
                  </td>

                  <td className="p-4">
                    ৳{a.fee}
                  </td>

                  <td className="p-4">
                    {a.date}
                  </td>

                  <td className="p-4">
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
