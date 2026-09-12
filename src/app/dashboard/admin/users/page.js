"use client";

import { useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { initialUsers } from "@/data/adminData";
import { Search, Trash2 } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase())
      ),
    [users, query]
  );

  function changeRole(id, role) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  function deleteUser(id) {
    if (confirm("Delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }

  return (
    <AdminShell title="Manage Users" subtitle="Search users, change roles and remove accounts.">
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
        <Search size={18} className="text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-left">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-zinc-100 text-sm">
                  <td className="px-5 py-4 font-bold text-zinc-900">{user.name}</td>
                  <td className="px-5 py-4 text-zinc-600">{user.email}</td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 outline-none focus:border-violet-500"
                    >
                      <option value="user">User</option>
                      <option value="librarian">Librarian</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
