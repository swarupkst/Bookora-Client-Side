"use client";

import Shell from "@/components/librarian/Shell";
import { Charts } from "@/components/librarian/Charts";
import DeliveryTable from "@/components/librarian/DeliveryTable";
import {
    BookOpen,
    Truck,
    Wallet,
    Clock,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
    const {
        data: session,
        isPending: sessionLoading,
    } = authClient.useSession();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                if (sessionLoading) return;

                if (!session?.user?.id) {
                    setBooks([]);
                    setLoading(false);
                    return;
                }

                const librarianId =
                    session.user.id;

                const response = await fetch(
                    `${baseUrl}/api/books?librarianId=${encodeURIComponent(
                        librarianId
                    )}`,
                    {
                        cache: "no-store",
                    }
                );

                const result =
                    await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                            "Failed to fetch books"
                    );
                }

                setBooks(result.data || []);
            } catch (error) {
                console.error(
                    "Dashboard books error:",
                    error
                );

                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [session, sessionLoading]);

    // =========================
    // Book Statistics
    // =========================

    const totalBooks = books.length;

    const publishedBooks = books.filter(
        (book) =>
            book.status?.toLowerCase() ===
            "approved"
    ).length;

    const pendingBooks = books.filter(
        (book) =>
            book.status?.toLowerCase() ===
            "pending"
    ).length;

    const cards = [
        [
            "Total Books Listed",
            totalBooks,
            BookOpen,
            `+${totalBooks} books in your inventory`,
        ],
        [
            "Published Books",
            publishedBooks,
            BookOpen,
            "Visible in Browse Books",
        ],
        [
            "Active Deliveries",
            "0",
            Truck,
            "Delivery API not connected",
        ],
        [
            "Total Earnings",
            "৳0",
            Wallet,
            "Earnings API not connected",
        ],
    ];

    return (
        <Shell>
            <div className="mb-7">
                <p className="text-sm font-bold text-[#5b4bdb]">
                    Overview
                </p>

                <h1 className="text-3xl font-black">
                    Librarian Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage your books, delivery
                    requests and earnings.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map(
                    ([title, value, Icon, description]) => (
                        <div
                            className="rounded-2xl border bg-white p-5 shadow-sm"
                            key={title}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        {title}
                                    </p>

                                    <b className="mt-2 block text-2xl">
                                        {loading &&
                                        title.includes(
                                            "Books"
                                        ) ? (
                                            <Loader2
                                                className="animate-spin text-[#5b4bdb]"
                                                size={24}
                                            />
                                        ) : (
                                            value
                                        )}
                                    </b>
                                </div>

                                <div className="rounded-xl bg-[#f1efff] p-3 text-[#5b4bdb]">
                                    <Icon />
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-500">
                                {description}
                            </p>
                        </div>
                    )
                )}
            </div>

            <div className="my-6">
                <Charts />
            </div>

            <DeliveryTable />
        </Shell>
    );
}