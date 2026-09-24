
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    Truck,
    User,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";
import { getBookById } from "@/lib/api/books";

export default function BookDetails({ id }) {
    const router = useRouter();

    const {
        data: session,
        isPending: sessionLoading,
    } = authClient.useSession();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] =
        useState(false);
    const [error, setError] = useState("");

    // Load book
    useEffect(() => {
        async function loadBook() {
            try {
                setLoading(true);
                setError("");

                const result = await getBookById(id);

                setBook(result.data);
            } catch (err) {
                console.error("Book details:", err);

                setError(
                    err.message ||
                        "Failed to load book."
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadBook();
        }
    }, [id]);

    // Loading state
    if (loading || sessionLoading) {
        return (
            <section className="flex min-h-[600px] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </section>
        );
    }

    // Error / not found
    if (error || !book) {
        return (
            <section className="mx-auto max-w-7xl px-5 py-24 text-center">
                <h1 className="text-3xl font-black">
                    Book not found
                </h1>

                <p className="mt-3 text-base-content/60">
                    {error ||
                        "This book is no longer available."}
                </p>

                <Link
                    href="/browse"
                    className="btn btn-primary mt-7 rounded-xl"
                >
                    <ArrowLeft size={17} />
                    Browse Books
                </Link>
            </section>
        );
    }

    /*
     * -------------------------------------------------------
     * BOOK STATUS
     * -------------------------------------------------------
     *
     * Your existing database already has quantity.
     *
     * If quantity is 0:
     *      Checked Out
     *
     * Otherwise:
     *      Available
     *
     * If your backend already provides a status field,
     * that value is also checked.
     */

    const quantity = Number(book.quantity || 0);

    const isCheckedOut =
        book.status === "Checked Out" ||
        book.status === "checked_out" ||
        book.status === "CheckedOut" ||
        quantity < 1;

    const isPendingDelivery =
        book.status === "Pending Delivery" ||
        book.status === "pending_delivery";

    /*
     * -------------------------------------------------------
     * LIBRARIAN OWNERSHIP
     * -------------------------------------------------------
     */

    const loggedInUserEmail =
        session?.user?.email?.toLowerCase();

    const librarianEmail =
        book.librarianEmail?.toLowerCase();

    const isBookOwner =
        !!loggedInUserEmail &&
        !!librarianEmail &&
        loggedInUserEmail === librarianEmail;

    /*
     * -------------------------------------------------------
     * REQUEST DELIVERY
     * -------------------------------------------------------
     */

    const deliveryDisabled =
        isCheckedOut ||
        isPendingDelivery ||
        isBookOwner ||
        checkoutLoading;

    const handleRequestDelivery = async () => {
        // User must be logged in
        if (!session?.user) {
            router.push(
                `/login?redirect=/books/${id}`
            );
            return;
        }

        // Owner cannot request their own book
        if (isBookOwner) {
            return;
        }

        // Cannot request unavailable book
        if (isCheckedOut || isPendingDelivery) {
            return;
        }

        try {
            setCheckoutLoading(true);
            setError("");

            /*
             * IMPORTANT:
             *
             * Do NOT calculate the final payment amount
             * on the client.
             *
             * The backend should read the book from MongoDB
             * and create the Stripe Checkout Session.
             */

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        bookId: id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to start checkout."
                );
            }

            if (!data.url) {
                throw new Error(
                    "Stripe checkout URL was not returned."
                );
            }

            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (err) {
            console.error(
                "Stripe checkout:",
                err
            );

            setError(
                err.message ||
                    "Unable to start payment."
            );

            setCheckoutLoading(false);
        }
    };

    /*
     * -------------------------------------------------------
     * DISPLAY STATUS
     * -------------------------------------------------------
     */

    let statusText = "Available";
    let statusClass = "badge-success";

    if (isCheckedOut) {
        statusText = "Checked Out";
        statusClass = "badge-error";
    } else if (isPendingDelivery) {
        statusText = "Pending Delivery";
        statusClass = "badge-warning";
    }

    return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
            {/* Back */}
            <Link
                href="/browse"
                className="btn btn-ghost mb-8 rounded-xl"
            >
                <ArrowLeft size={17} />
                Back to Browse
            </Link>

            <div className="grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-16">
                {/* =================================================
                    COVER
                ================================================== */}

                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-base-200 shadow-xl">
                    {book.coverImage ? (
                        <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 400px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <BookOpen
                                size={70}
                                className="text-base-content/20"
                            />
                        </div>
                    )}
                </div>

                {/* =================================================
                    INFORMATION
                ================================================== */}

                <div>
                    {/* Category + Status */}
                    <div className="flex flex-wrap gap-2">
                        {book.category && (
                            <span className="badge badge-primary badge-outline px-3 py-3">
                                {book.category}
                            </span>
                        )}

                        <span
                            className={`badge ${statusClass} px-3 py-3`}
                        >
                            {statusText}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                        {book.title}
                    </h1>

                    {/* Author */}
                    <p className="mt-4 flex items-center gap-2 text-lg text-base-content/60">
                        <User size={18} />
                        {book.author}
                    </p>

                    <div className="my-8 h-px bg-base-300" />

                    {/* Description */}
                    <div>
                        <h2 className="mb-3 text-xl font-bold">
                            About this book
                        </h2>

                        <p className="text-base leading-8 text-base-content/65">
                            {book.description ||
                                "No description available for this book."}
                        </p>
                    </div>

                    {/* Information cards */}
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {/* Delivery Fee */}
                        <div className="rounded-2xl bg-base-100 p-5 shadow-sm">
                            <Truck
                                size={20}
                                className="text-primary"
                            />

                            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-base-content/45">
                                Delivery Fee
                            </p>

                            <p className="mt-1 text-2xl font-black">
                                ৳
                                {Number(
                                    book.deliveryFee || 0
                                ).toFixed(2)}
                            </p>
                        </div>

                        {/* Date Added */}
                        <div className="rounded-2xl bg-base-100 p-5 shadow-sm">
                            <CalendarDays
                                size={20}
                                className="text-primary"
                            />

                            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-base-content/45">
                                Date Added
                            </p>

                            <p className="mt-1 font-bold">
                                {book.createdAt
                                    ? new Date(
                                          book.createdAt
                                      ).toLocaleDateString(
                                          "en-BD",
                                          {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          }
                                      )
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        DELIVERY BUTTON
                    ================================================== */}

                    {!session?.user ? (
                        <button
                            onClick={
                                handleRequestDelivery
                            }
                            className="btn btn-primary btn-lg mt-8 w-full rounded-xl sm:w-auto"
                        >
                            <Truck size={19} />
                            Login to Request Delivery
                        </button>
                    ) : isBookOwner ? (
                        <button
                            disabled
                            className="btn btn-disabled btn-lg mt-8 w-full rounded-xl sm:w-auto"
                        >
                            <User size={19} />
                            You Own This Book
                        </button>
                    ) : isCheckedOut ? (
                        <button
                            disabled
                            className="btn btn-disabled btn-lg mt-8 w-full rounded-xl sm:w-auto"
                        >
                            <Truck size={19} />
                            Currently Checked Out
                        </button>
                    ) : isPendingDelivery ? (
                        <button
                            disabled
                            className="btn btn-disabled btn-lg mt-8 w-full rounded-xl sm:w-auto"
                        >
                            <Truck size={19} />
                            Pending Delivery
                        </button>
                    ) : (
                        <button
                            onClick={
                                handleRequestDelivery
                            }
                            disabled={deliveryDisabled}
                            className="btn btn-primary btn-lg mt-8 w-full rounded-xl sm:w-auto"
                        >
                            {checkoutLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Redirecting...
                                </>
                            ) : (
                                <>
                                    <Truck size={19} />
                                    Request Delivery
                                </>
                            )}
                        </button>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="mt-3 text-sm text-error">
                            {error}
                        </p>
                    )}

                    {/* Payment information */}
                    {!isCheckedOut &&
                        !isPendingDelivery &&
                        !isBookOwner && (
                            <p className="mt-3 text-sm text-base-content/50">
                                You will be redirected to
                                Stripe Checkout to pay the
                                delivery fee.
                            </p>
                        )}

                    {/* =================================================
                        LIBRARIAN
                    ================================================== */}

                    <div className="mt-8 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen size={18} />
                        </div>

                        <div>
                            <p className="text-sm font-bold">
                                Listed by{" "}
                                {book.librarianName ||
                                    "Bookora Librarian"}
                            </p>

                            {book.librarianEmail && (
                                <p className="text-xs text-base-content/50">
                                    {
                                        book.librarianEmail
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================================
                REVIEWS
            ================================================== */}

            <section className="mt-20 border-t border-base-300 pt-12">
                <h2 className="text-3xl font-black">
                    Reviews
                </h2>

                <p className="mt-3 text-base-content/55">
                    Reviews from verified readers will
                    appear here.
                </p>
            </section>
        </section>
    );
}
