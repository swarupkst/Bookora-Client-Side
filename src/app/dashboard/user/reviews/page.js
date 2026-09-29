"use client";

import { useEffect, useState } from "react";
import {
    Pencil,
    Trash2,
    Star,
    Loader2,
    MessageSquare,
} from "lucide-react";

import Shell from "@/components/user/Shell";
import {
    API_getReviews,
    API_updateReview,
    API_deleteReview,
} from "@/data/Userdata";

export default function Page() {
    const [reviews, setReviews] = useState([]);
    const [edit, setEdit] = useState(null);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await API_getReviews();
                setReviews(data || []);
            } catch (error) {
                console.error("Failed to load reviews:", error);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, []);

    function getId(review) {
        return review._id || review.id;
    }

    function startEdit(review) {
        setEdit(getId(review));
        setComment(review.comment || "");
        setRating(Number(review.rating) || 5);
    }

    function cancelEdit() {
        setEdit(null);
        setComment("");
        setRating(5);
    }

    async function save(id) {
        try {
            setSaving(true);

            const updatedReview = await API_updateReview(id, {
                comment,
                rating: Number(rating),
            });

            setReviews((previous) =>
                previous.map((review) =>
                    getId(review) === id
                        ? {
                              ...review,
                              ...updatedReview,
                          }
                        : review
                )
            );

            cancelEdit();
        } catch (error) {
            console.error("Failed to update review:", error);
        } finally {
            setSaving(false);
        }
    }

    async function remove(id) {
        if (!confirm("Are you sure you want to delete this review?")) {
            return;
        }

        try {
            setDeleting(id);

            await API_deleteReview(id);

            setReviews((previous) =>
                previous.filter(
                    (review) => getId(review) !== id
                )
            );
        } catch (error) {
            console.error("Failed to delete review:", error);
        } finally {
            setDeleting(null);
        }
    }

    function renderStars(value, size = 16) {
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                        key={index}
                        size={size}
                        className={
                            index < Number(value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-zinc-300"
                        }
                    />
                ))}
            </div>
        );
    }

    return (
        <Shell>
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                        <MessageSquare size={21} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-zinc-900">
                            My Reviews
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Manage and update your book reviews.
                        </p>
                    </div>
                </div>

                {/* Review List */}
                <div className="mt-7 space-y-4">
                    {loading ? (
                        <div className="card flex min-h-40 items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                                Loading your reviews...
                            </div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="card flex min-h-52 flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                                <MessageSquare size={22} />
                            </div>

                            <h3 className="mt-4 font-bold text-zinc-800">
                                No reviews yet
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-zinc-500">
                                Your submitted book reviews will
                                appear here.
                            </p>
                        </div>
                    ) : (
                        reviews.map((review, index) => {
                            const id =
                                getId(review) ||
                                `review-${index}`;

                            const isEditing = edit === id;

                            return (
                                <div
                                    key={id}
                                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                                >
                                    {isEditing ? (
                                        /* Edit Review */
                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-lg font-black text-zinc-900">
                                                    {review.bookTitle ||
                                                        "Book Review"}
                                                </p>

                                                <p className="mt-1 text-xs text-zinc-400">
                                                    Editing your review
                                                </p>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-zinc-700">
                                                    Rating
                                                </label>

                                                <select
                                                    className="input max-w-xs"
                                                    value={rating}
                                                    onChange={(e) =>
                                                        setRating(
                                                            Number(
                                                                e.target
                                                                    .value
                                                            )
                                                        )
                                                    }
                                                >
                                                    <option value={5}>
                                                        5 Stars
                                                    </option>
                                                    <option value={4}>
                                                        4 Stars
                                                    </option>
                                                    <option value={3}>
                                                        3 Stars
                                                    </option>
                                                    <option value={2}>
                                                        2 Stars
                                                    </option>
                                                    <option value={1}>
                                                        1 Star
                                                    </option>
                                                </select>

                                                <div className="mt-2">
                                                    {renderStars(rating)}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-zinc-700">
                                                    Your Review
                                                </label>

                                                <textarea
                                                    className="input min-h-28 w-full resize-none"
                                                    value={comment}
                                                    onChange={(e) =>
                                                        setComment(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Write your thoughts about this book..."
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                                                    onClick={() =>
                                                        save(id)
                                                    }
                                                    disabled={saving}
                                                >
                                                    {saving && (
                                                        <Loader2
                                                            size={15}
                                                            className="animate-spin"
                                                        />
                                                    )}

                                                    {saving
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>

                                                <button
                                                    className="btn-soft"
                                                    onClick={
                                                        cancelEdit
                                                    }
                                                    disabled={saving}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Review */
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="text-lg font-black text-zinc-900">
                                                    {review.bookTitle ||
                                                        "Untitled Book"}
                                                </p>

                                                <div className="mt-2 flex items-center gap-2">
                                                    {renderStars(
                                                        review.rating
                                                    )}

                                                    <span className="text-xs font-semibold text-zinc-500">
                                                        {Number(
                                                            review.rating
                                                        ) || 0}
                                                        /5
                                                    </span>
                                                </div>

                                                <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                                                    {review.comment ||
                                                        "No comment added."}
                                                </p>

                                                <p className="mt-3 text-xs text-zinc-400">
                                                    {review.date ||
                                                        (review.createdAt
                                                            ? new Date(
                                                                  review.createdAt
                                                              ).toLocaleDateString()
                                                            : "No date")}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    onClick={() =>
                                                        startEdit(
                                                            review
                                                        )
                                                    }
                                                    className="btn-soft inline-flex items-center gap-2"
                                                >
                                                    <Pencil
                                                        size={15}
                                                    />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        remove(id)
                                                    }
                                                    disabled={
                                                        deleting === id
                                                    }
                                                    className="btn-danger inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {deleting === id ? (
                                                        <Loader2
                                                            size={15}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Trash2
                                                            size={15}
                                                        />
                                                    )}

                                                    {deleting === id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Shell>
    );
}