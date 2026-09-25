"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Search,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const USERS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);

      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // Search / Filter
  // =========================
  const filtered = useMemo(() => {
    return users.filter((user) =>
      `${user.name || ""} ${user.email || ""} ${user.role || ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [users, query]);

  // =========================
  // Reset page when searching
  // =========================
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // =========================
  // Pagination
  // =========================
  const totalPages = Math.ceil(
    filtered.length / USERS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * USERS_PER_PAGE;

  const endIndex =
    startIndex + USERS_PER_PAGE;

  const currentUsers = filtered.slice(
    startIndex,
    endIndex
  );

  // Keep current page valid after deleting users
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // =========================
  // Change Role
  // =========================
  async function changeRole(id, role) {
    try {
      setUpdatingId(id);

      const response = await fetch(
        `/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update role"
        );
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                role:
                  data.user?.role ||
                  role,
              }
            : user
        )
      );
    } catch (error) {
      console.error(
        "Error changing role:",
        error
      );

      alert(
        error.message ||
          "Failed to change user role."
      );

      // Reload original data if update fails
      fetchUsers();
    } finally {
      setUpdatingId(null);
    }
  }

  // =========================
  // Delete User
  // =========================
  async function deleteUser(id) {
    if (
      !confirm(
        "Are you sure you want to delete this user?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete user"
        );
      }

      setUsers((prev) =>
        prev.filter(
          (user) => user._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error deleting user:",
        error
      );

      alert(
        error.message ||
          "Failed to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================
  // Page Navigation
  // =========================
  function goToPage(page) {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  }

  return (
    <AdminShell
      title="Manage Users"
      subtitle="Search users, change roles and remove accounts."
    >
      {/* Search */}
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
        <Search
          size={18}
          className="text-zinc-400"
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search users..."
          className="w-full outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-left">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3">
                  Name
                </th>

                <th className="px-5 py-3">
                  Email
                </th>

                <th className="px-5 py-3">
                  Role
                </th>

                <th className="px-5 py-3">
                  Status
                </th>

                <th className="px-5 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-zinc-500">
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                /* Empty */
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-zinc-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                /* Users */
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-zinc-100 text-sm"
                  >
                    {/* Name */}
                    <td className="px-5 py-4 font-bold text-zinc-900">
                      {user.name || "N/A"}
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-zinc-600">
                      {user.email || "N/A"}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={
                            user.role ||
                            "user"
                          }
                          disabled={
                            updatingId ===
                            user._id
                          }
                          onChange={(e) =>
                            changeRole(
                              user._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="user">
                            User
                          </option>

                          <option value="librarian">
                            Librarian
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>

                        {updatingId ===
                          user._id && (
                          <Loader2
                            size={16}
                            className="animate-spin text-violet-500"
                          />
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Active
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          deleteUser(
                            user._id
                          )
                        }
                        disabled={
                          deletingId ===
                          user._id
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId ===
                        user._id ? (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2
                            size={15}
                          />
                        )}

                        {deletingId ===
                        user._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =========================
            Pagination
        ========================= */}
        {!loading &&
          filtered.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Showing Count */}
              <div className="text-sm text-zinc-500">
                Showing{" "}
                <span className="font-semibold text-zinc-700">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-zinc-700">
                  {Math.min(
                    endIndex,
                    filtered.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-zinc-700">
                  {filtered.length}
                </span>{" "}
                users
              </div>

              {/* Pagination Buttons */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <button
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={15}
                    />

                    <span className="hidden sm:inline">
                      Previous
                    </span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      {
                        length: totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          goToPage(page)
                        }
                        className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${
                          currentPage ===
                          page
                            ? "bg-zinc-900 text-white"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">
                      Next
                    </span>

                    <ChevronRight
                      size={15}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
      </div>
    </AdminShell>
  );
}