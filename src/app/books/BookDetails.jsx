"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    Heart,
    Truck,
    User,
    Pencil,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";
import { getBookById } from "@/lib/api/books";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

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

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    const [error, setError] = useState("");

    /*
     * =======================================================
     * USER ROLE
     * =======================================================
     */

    const userRole =
        session?.user?.role
            ?.trim()
            .toLowerCase();

    const isAdmin =
        userRole === "admin";

    const isLibrarian =
        userRole === "librarian";

    const isRegularUser =
        !isAdmin && !isLibrarian;

    /*
     * =======================================================
     * LOAD BOOK
     * =======================================================
     */

    useEffect(() => {
        async function loadBook() {
            try {
                setLoading(true);
                setError("");

                const result =
                    await getBookById(id);

                setBook(result.data);
            } catch (err) {
                console.error(
                    "Book details:",
                    err
                );

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

    /*
     * =======================================================
     * LIBRARIAN OWNERSHIP
     * =======================================================
     *
     * Librarian can edit ONLY their own book.
     *
     * We compare the logged-in user's email with
     * book.librarianEmail.
     * =======================================================
     */

    const loggedInUserEmail =
        session?.user?.email
            ?.trim()
            .toLowerCase();

    const librarianEmail =
        book?.librarianEmail
            ?.trim()
            .toLowerCase();

    const isBookOwner =
        isLibrarian &&
        Boolean(loggedInUserEmail) &&
        Boolean(librarianEmail) &&
        loggedInUserEmail ===
            librarianEmail;

    /*
     * =======================================================
     * CHECK WISHLIST
     * =======================================================
     *
     * Wishlist is ONLY available for regular users.
     * Admin and Librarian do not need wishlist checking.
     * =======================================================
     */

    useEffect(() => {
        async function checkWishlist() {
            if (
                !isRegularUser ||
                !session?.user?.id ||
                !id
            ) {
                setIsWishlisted(false);
                return;
            }

            try {
                const response =
                    await fetch(
                        `${API_URL}/api/wishlist?userId=${encodeURIComponent(
                            session.user.id
                        )}`,
                        {
                            credentials:
                                "include",
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to load wishlist."
                    );
                }

                const exists =
                    data.data?.some(
                        (item) =>
                            String(
                                item.bookId
                            ) ===
                            String(id)
                    );

                setIsWishlisted(
                    exists
                );
            } catch (err) {
                console.error(
                    "Check wishlist:",
                    err
                );

                setIsWishlisted(false);
            }
        }

        if (!sessionLoading) {
            checkWishlist();
        }
    }, [
        session,
        sessionLoading,
        id,
        isRegularUser,
    ]);

    /*
     * =======================================================
     * WISHLIST
     * =======================================================
     */

    const handleWishlist = async () => {
        if (!session?.user) {
            router.push(
                `/login?redirect=/books/${id}`
            );
            return;
        }

        // Only regular users can use wishlist
        if (!isRegularUser) {
            return;
        }

        try {
            setWishlistLoading(true);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/wishlist`,
                    {
                        method: isWishlisted
                            ? "DELETE"
                            : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        body: JSON.stringify({
                            userId:
                                session.user
                                    .id,

                            bookId: id,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to update wishlist."
                );
            }

            setIsWishlisted(
                !isWishlisted
            );
        } catch (err) {
            console.error(
                "Wishlist:",
                err
            );

            setError(
                err.message ||
                    "Unable to update wishlist."
            );
        } finally {
            setWishlistLoading(false);
        }
    };

    /*
     * =======================================================
     * BOOK AVAILABILITY
     * =======================================================
     */

    const quantity = Number(
        book?.quantity || 0
    );

    const isCheckedOut =
        book?.status === "Checked Out" ||
        book?.status === "checked_out" ||
        book?.status === "CheckedOut" ||
        quantity < 1;

    const isPendingDelivery =
        book?.status ===
            "Pending Delivery" ||
        book?.status ===
            "pending_delivery";

    /*
     * =======================================================
     * DELIVERY BUTTON STATE
     * =======================================================
     *
     * Delivery is available ONLY for regular users.
     * =======================================================
     */

    const deliveryDisabled =
        isCheckedOut ||
        isPendingDelivery ||
        checkoutLoading;

    /*
     * =======================================================
     * STRIPE CHECKOUT
     * =======================================================
     */

    const handleRequestDelivery =
        async () => {
            // User must be logged in
            if (!session?.user) {
                router.push(
                    `/login?redirect=/books/${id}`
                );
                return;
            }

            // Admin and librarian cannot request delivery
            if (!isRegularUser) {
                return;
            }

            // Cannot request unavailable book
            if (
                isCheckedOut ||
                isPendingDelivery
            ) {
                return;
            }

            try {
                setCheckoutLoading(true);
                setError("");

                const response =
                    await fetch(
                        `${API_URL}/payments/create-checkout-session`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            credentials:
                                "include",

                            body: JSON.stringify({
                                bookId: id,
                            }),
                        }
                    );

                const data =
                    await response.json();

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

                window.location.href =
                    data.url;
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
     * =======================================================
     * LOADING STATE
     * =======================================================
     */

    if (
        loading ||
        sessionLoading
    ) {
        return (
            <section className="flex min-h-[600px] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </section>
        );
    }

    /*
     * =======================================================
     * ERROR / NOT FOUND
     * =======================================================
     */

    if (error && !book) {
        return (
            <section className="mx-auto max-w-7xl px-5 py-24 text-center">
                <h1 className="text-3xl font-black">
                    Book not found
                </h1>

                <p className="mt-3 text-base-content/60">
                    {error}
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

    if (!book) {
        return (
            <section className="mx-auto max-w-7xl px-5 py-24 text-center">
                <h1 className="text-3xl font-black">
                    Book not found
                </h1>

                <p className="mt-3 text-base-content/60">
                    This book is no longer available.
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
     * =======================================================
     * DISPLAY STATUS
     * =======================================================
     */

    let statusText = "Available";

    let statusClass =
        "badge-success";

    if (isCheckedOut) {
        statusText = "Checked Out";

        statusClass =
            "badge-error";
    } else if (isPendingDelivery) {
        statusText =
            "Pending Delivery";

        statusClass =
            "badge-warning";
    }

    return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">

            {/* =================================================
                BACK
            ================================================== */}

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
                            src={
                                book.coverImage
                            }
                            alt={
                                book.title
                            }
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
                                {
                                    book.category
                                }
                            </span>
                        )}

                        <span
                            className={`badge ${statusClass} px-3 py-3`}
                        >
                            {
                                statusText
                            }
                        </span>

                    </div>

                    {/* Title */}

                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                        {book.title}
                    </h1>

                    {/* Author */}

                    <p className="mt-4 flex items-center gap-2 text-lg text-base-content/60">
                        <User
                            size={18}
                        />

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

                    {/* =================================================
                        INFORMATION CARDS
                    ================================================== */}

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
                                $
                                {Number(
                                    book.deliveryFee ||
                                        0
                                ).toFixed(
                                    2
                                )}
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
                        ACTION BUTTONS
                    ================================================== */}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                        {/* =================================================
                            REGULAR USER ACTIONS
                        ================================================== */}

                        {isRegularUser && (
                            <>
                                {/* ADD / REMOVE WISHLIST */}

                                <button
                                    onClick={
                                        handleWishlist
                                    }
                                    disabled={
                                        wishlistLoading
                                    }
                                    className={`btn btn-lg rounded-xl ${
                                        isWishlisted
                                            ? "btn-secondary"
                                            : "btn-outline"
                                    }`}
                                >

                                    {wishlistLoading ? (
                                        <span className="loading loading-spinner loading-sm" />
                                    ) : (
                                        <Heart
                                            size={
                                                19
                                            }
                                            fill={
                                                isWishlisted
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    )}

                                    {wishlistLoading
                                        ? "Saving..."
                                        : isWishlisted
                                        ? "Remove from Wishlist"
                                        : "Add to Wishlist"}

                                </button>

                                {/* =================================================
                                    REQUEST DELIVERY
                                ================================================== */}

                                {!session?.user ? (
                                    <button
                                        onClick={
                                            handleRequestDelivery
                                        }
                                        className="btn btn-primary btn-lg rounded-xl"
                                    >
                                        <Truck
                                            size={
                                                19
                                            }
                                        />

                                        Login to Request
                                        Delivery
                                    </button>
                                ) : isCheckedOut ? (
                                    <button
                                        disabled
                                        className="btn btn-disabled btn-lg rounded-xl"
                                    >
                                        <Truck
                                            size={
                                                19
                                            }
                                        />

                                        Currently
                                        Checked Out
                                    </button>
                                ) : isPendingDelivery ? (
                                    <button
                                        disabled
                                        className="btn btn-disabled btn-lg rounded-xl"
                                    >
                                        <Truck
                                            size={
                                                19
                                            }
                                        />

                                        Pending Delivery
                                    </button>
                                ) : (
                                    <button
                                        onClick={
                                            handleRequestDelivery
                                        }
                                        disabled={
                                            deliveryDisabled
                                        }
                                        className="btn btn-primary btn-lg rounded-xl"
                                    >

                                        {checkoutLoading ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm" />

                                                Redirecting...
                                            </>
                                        ) : (
                                            <>
                                                <Truck
                                                    size={
                                                        19
                                                    }
                                                />

                                                Request
                                                Delivery
                                            </>
                                        )}

                                    </button>
                                )}
                            </>
                        )}

                        {/* =================================================
                            LIBRARIAN
                            OWN BOOK ONLY
                        ================================================== */}

                        {isBookOwner && (
                            <Link
                                href={`/dashboard/librarian/edit-book/${book._id}`}
                                className="btn btn-primary btn-lg rounded-xl"
                            >
                                <Pencil
                                    size={19}
                                />

                                Edit Book
                            </Link>
                        )}

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <p className="mt-3 text-sm text-error">
                            {error}
                        </p>
                    )}

                    {/* =================================================
                        PAYMENT INFORMATION
                        ONLY REGULAR USER
                    ================================================== */}

                    {isRegularUser &&
                        !isCheckedOut &&
                        !isPendingDelivery && (
                            <p className="mt-3 text-sm text-base-content/50">
                                You will be
                                redirected to
                                Stripe Checkout
                                to pay the delivery
                                fee of $
                                {Number(
                                    book.deliveryFee ||
                                        0
                                ).toFixed(
                                    2
                                )}
                                .
                            </p>
                        )}

                    {/* =================================================
                        LIBRARIAN INFORMATION
                    ================================================== */}

                    <div className="mt-8 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-4">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen
                                size={18}
                            />
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
                    Reviews from verified readers
                    will appear here.
                </p>

            </section>

        </section>
    );
}