"use client";

import Shell from "@/components/librarian/Shell";
import { useState } from "react";
import {
    UploadCloud,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { addBook } from "@/lib/actions/addBook";

export default function AddBook() {
    const {
        data: session,
        isPending: sessionLoading,
    } = authClient.useSession();

    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [img, setImg] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        quantity: "",
        deliveryFee: "",
        category: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImagePreview = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size cannot exceed 5MB.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        setError("");
        setImageFile(file);

        const previewUrl = URL.createObjectURL(file);

        setImg(previewUrl);
    };

    const uploadImageToImgBB = async (file) => {
        if (!file) {
            throw new Error(
                "Please select a book cover image."
            );
        }

        const uploadData = new FormData();

        uploadData.append("image", file);

        const response = await fetch(
            "/api/upload-image",
            {
                method: "POST",
                body: uploadData,
            }
        );

        const contentType =
            response.headers.get(
                "content-type"
            );

        if (
            !contentType?.includes(
                "application/json"
            )
        ) {
            const text =
                await response.text();

            console.error(
                "Upload API returned non-JSON:",
                text
            );

            throw new Error(
                "Image upload server returned an invalid response."
            );
        }

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                    "Failed to upload image."
            );
        }

        return result.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setDone(false);
        setError("");

        try {
            // Check login session
            if (sessionLoading) {
                throw new Error(
                    "Please wait while your account information is loading."
                );
            }

            if (!session?.user) {
                throw new Error(
                    "You must be logged in to add a book."
                );
            }

            // Get librarian ID
            const librarianId =
                session.user.id;

            if (!librarianId) {
                throw new Error(
                    "Your account ID could not be found."
                );
            }

            // Get librarian name
            const librarianName =
                session.user.name?.trim();

            if (!librarianName) {
                throw new Error(
                    "Your account name could not be found."
                );
            }

            // Upload image
            let coverImage = "";

            if (imageFile) {
                coverImage =
                    await uploadImageToImgBB(
                        imageFile
                    );
            }

            const newBookData = {
                title: formData.title.trim(),

                author: formData.author.trim(),

                description:
                    formData.description.trim(),

                quantity:
                    Number(
                        formData.quantity
                    ),

                deliveryFee:
                    Number(
                        formData.deliveryFee
                    ),

                category:
                    formData.category,

                coverImage,

                // Logged-in librarian information
                librarianId,

                librarianName,

                // New books remain pending
                status: "pending",

                createdAt:
                    new Date().toISOString(),
            };

            console.log(
                "Submitting book:",
                newBookData
            );

            const result =
                await addBook(
                    newBookData
                );

            if (
                result?.success === false
            ) {
                throw new Error(
                    result?.message ||
                        "Failed to submit book"
                );
            }

            setDone(true);

            setFormData({
                title: "",
                author: "",
                description: "",
                quantity: "",
                deliveryFee: "",
                category: "",
            });

            setImg("");
            setImageFile(null);

        } catch (error) {
            console.error(error);

            setError(
                error?.message ||
                    "Failed to submit book. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Shell>
            <div className="mb-4">
                <h1 className="text-2xl font-black">
                    Add New Book
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                    Submit a new book for admin
                    approval.
                </p>
            </div>

            {done && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                    <CheckCircle2
                        className="mr-2 inline"
                        size={17}
                    />

                    Submitted successfully —
                    Pending Approval
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="grid gap-4 xl:grid-cols-3"
            >
                {/* =========================
                    LEFT - FORM
                ========================== */}
                <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">

                    {/* Title + Author */}
                    <div className="grid gap-4 md:grid-cols-2">

                        {/* Book Title */}
                        <label className="block">
                            <b className="mb-1.5 block text-xs">
                                Book Title *
                            </b>

                            <input
                                required
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-[#5b4bdb]"
                                placeholder="Enter book title"
                            />
                        </label>

                        {/* Author */}
                        <label className="block">
                            <b className="mb-1.5 block text-xs">
                                Author *
                            </b>

                            <input
                                required
                                type="text"
                                name="author"
                                value={
                                    formData.author
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-[#5b4bdb]"
                                placeholder="Enter author name"
                            />
                        </label>

                    </div>

                    {/* Quantity + Delivery Fee + Category */}
                    <div className="grid gap-4 md:grid-cols-3">

                        {/* Quantity */}
                        <label>
                            <b className="mb-1.5 block text-xs">
                                Book Quantity *
                            </b>

                            <input
                                required
                                type="number"
                                name="quantity"
                                value={
                                    formData.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                min="1"
                                step="1"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-[#5b4bdb]"
                                placeholder="10"
                            />
                        </label>

                        {/* Delivery Fee */}
                        <label>
                            <b className="mb-1.5 block text-xs">
                                Delivery Fee *
                            </b>

                            <input
                                required
                                type="number"
                                name="deliveryFee"
                                value={
                                    formData.deliveryFee
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="1"
                                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-[#5b4bdb]"
                                placeholder="80"
                            />
                        </label>

                        {/* Category */}
                        <label>
                            <b className="mb-1.5 block text-xs">
                                Category *
                            </b>

                            <select
                                required
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5b4bdb]"
                            >
                                <option value="">
                                    Select category
                                </option>

                                <option value="Programming">
                                    Programming
                                </option>

                                <option value="Self Development">
                                    Self Development
                                </option>

                                <option value="Productivity">
                                    Productivity
                                </option>

                                <option value="Literature">
                                    Literature
                                </option>
                            </select>
                        </label>

                    </div>

                    {/* Description */}
                    <label className="block">
                        <b className="mb-1.5 block text-xs">
                            Description *
                        </b>

                        <textarea
                            required
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            rows="3"
                            className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-[#5b4bdb]"
                            placeholder="Write a short description about the book..."
                        />
                    </label>

                    {/* Image Upload */}
                    <div>
                        <b className="mb-1.5 block text-xs">
                            Book Cover
                        </b>

                        <label className="flex h-[42px] cursor-pointer items-center gap-2 rounded-lg border border-dashed bg-slate-50 px-3 transition hover:border-[#5b4bdb] hover:bg-[#5b4bdb]/5">

                            <UploadCloud
                                className="shrink-0 text-[#5b4bdb]"
                                size={20}
                            />

                            <div className="min-w-0">
                                <p className="truncate text-xs font-bold">
                                    {imageFile
                                        ? imageFile.name
                                        : "Choose book cover"}
                                </p>

                                <p className="text-[10px] text-slate-400">
                                    JPG, PNG or WebP •
                                    Max 5MB
                                </p>
                            </div>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={
                                    handleImagePreview
                                }
                            />
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={
                            loading ||
                            sessionLoading
                        }
                        className="flex w-full items-center justify-center rounded-lg bg-[#5b4bdb] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4d3fc4] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2
                                    className="mr-2 animate-spin"
                                    size={17}
                                />

                                {imageFile
                                    ? "Uploading & Submitting..."
                                    : "Submitting..."}
                            </>
                        ) : (
                            "Submit for Approval"
                        )}
                    </button>
                </div>

                {/* =========================
                    RIGHT - COVER PREVIEW
                ========================== */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-3 flex items-center justify-between">
                        <b className="text-sm">
                            Book Cover Preview
                        </b>

                        {img && (
                            <button
                                type="button"
                                onClick={() => {
                                    setImg("");
                                    setImageFile(
                                        null
                                    );
                                }}
                                className="text-xs font-semibold text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <label className="flex h-[390px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-slate-50">

                        {img ? (
                            <img
                                src={img}
                                className="h-full w-full object-cover"
                                alt="Book cover preview"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                                <UploadCloud
                                    className="text-[#5b4bdb]"
                                    size={38}
                                />

                                <span className="mt-3 text-sm font-bold">
                                    Upload Cover
                                </span>

                                <span className="mt-1 text-xs text-slate-400">
                                    Click to select an
                                    image
                                </span>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={
                                handleImagePreview
                            }
                        />
                    </label>

                    <p className="mt-3 text-center text-[10px] text-slate-400">
                        The image will be uploaded to
                        ImgBB when you submit the form.
                    </p>
                </div>
            </form>
        </Shell>
    );
}