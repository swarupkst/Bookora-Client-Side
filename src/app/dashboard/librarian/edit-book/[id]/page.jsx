
"use client";

import Shell from "@/components/librarian/Shell";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    UploadCloud,
    CheckCircle2,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

export default function EditBook() {
    const params = useParams();

    const bookId = params?.id;

    const {
        data: session,
        isPending: sessionLoading,
    } = authClient.useSession();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [done, setDone] = useState(false);
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

    const baseUrl =
        process.env.NEXT_PUBLIC_API_URL;

    // ==========================================
    // Fetch Existing Book
    // ==========================================
    useEffect(() => {
        if (sessionLoading) return;

        if (!bookId) {
            setError(
                "Book ID could not be found."
            );
            setLoading(false);
            return;
        }

        if (!session?.user?.id) {
            setError(
                "Unable to identify the logged-in librarian."
            );
            setLoading(false);
            return;
        }

        const fetchBook = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await fetch(
                        `${baseUrl}/api/books/${bookId}`,
                        {
                            cache: "no-store",
                        }
                    );

                const result =
                    await response.json();

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                            "Failed to load book."
                    );
                }

                const book = result.data;

                if (!book) {
                    throw new Error(
                        "Book information was not found."
                    );
                }

                // ==================================
                // Ownership Check
                // ==================================
                if (
                    book.librarianId !==
                    session.user.id
                ) {
                    throw new Error(
                        "You can only edit your own books."
                    );
                }

                // ==================================
                // Fill Form
                // ==================================
                setFormData({
                    title:
                        book.title || "",

                    author:
                        book.author || "",

                    description:
                        book.description || "",

                    quantity:
                        book.quantity !==
                            undefined &&
                        book.quantity !== null
                            ? String(
                                  book.quantity
                              )
                            : "",

                    deliveryFee:
                        book.deliveryFee !==
                            undefined &&
                        book.deliveryFee !==
                            null
                            ? String(
                                  book.deliveryFee
                              )
                            : "",

                    category:
                        book.category || "",
                });

                // ==================================
                // Existing Cover
                // ==================================
                if (book.coverImage) {
                    setImg(
                        book.coverImage
                    );
                }

            } catch (error) {
                console.error(
                    "Fetch book error:",
                    error
                );

                setError(
                    error?.message ||
                        "Failed to load book."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [
        bookId,
        session,
        sessionLoading,
        baseUrl,
    ]);

    // ==========================================
    // Handle Input Change
    // ==========================================
    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setDone(false);
        setError("");
    };

    // ==========================================
    // Image Preview
    // ==========================================
    const handleImagePreview = (e) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        // Maximum 5MB
        if (
            file.size >
            5 * 1024 * 1024
        ) {
            setError(
                "Image size cannot exceed 5MB."
            );
            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            setError(
                "Please select a valid image file."
            );
            return;
        }

        setError("");
        setDone(false);

        setImageFile(file);

        const previewUrl =
            URL.createObjectURL(
                file
            );

        setImg(previewUrl);
    };

    // ==========================================
    // Upload Image to ImgBB
    // ==========================================
    const uploadImageToImgBB =
        async (file) => {
            if (!file) {
                throw new Error(
                    "Please select a book cover image."
                );
            }

            const uploadData =
                new FormData();

            uploadData.append(
                "image",
                file
            );

            const response =
                await fetch(
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

    // ==========================================
    // Remove Image
    // ==========================================
    const handleRemoveImage =
        () => {
            setImg("");
            setImageFile(null);
            setDone(false);
            setError("");
        };

    // ==========================================
    // Save Changes
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setDone(false);
        setError("");

        try {
            // ==================================
            // Session Check
            // ==================================
            if (sessionLoading) {
                throw new Error(
                    "Please wait while your account information is loading."
                );
            }

            if (!session?.user) {
                throw new Error(
                    "You must be logged in to edit a book."
                );
            }

            const librarianId =
                session.user.id;

            if (!librarianId) {
                throw new Error(
                    "Your account ID could not be found."
                );
            }

            if (!bookId) {
                throw new Error(
                    "Book ID could not be found."
                );
            }

            // ==================================
            // Validate Quantity
            // ==================================
            const quantity =
                Number(
                    formData.quantity
                );

            if (
                !Number.isInteger(
                    quantity
                ) ||
                quantity < 1
            ) {
                throw new Error(
                    "Book quantity must be at least 1."
                );
            }

            // ==================================
            // Validate Delivery Fee
            // ==================================
            const deliveryFee =
                Number(
                    formData.deliveryFee
                );

            if (
                Number.isNaN(
                    deliveryFee
                ) ||
                deliveryFee < 0
            ) {
                throw new Error(
                    "Delivery fee cannot be negative."
                );
            }

            // ==================================
            // Cover Image
            // ==================================
            let coverImage = img;

            // If new image selected
            // upload it to ImgBB
            if (imageFile) {
                coverImage =
                    await uploadImageToImgBB(
                        imageFile
                    );
            }

            // ==================================
            // Updated Book Data
            // ==================================
            const updatedBookData = {
                title:
                    formData.title.trim(),

                author:
                    formData.author.trim(),

                description:
                    formData.description.trim(),

                quantity,

                deliveryFee,

                category:
                    formData.category,

                coverImage,

                librarianId,
            };

            console.log(
                "Updating book:",
                updatedBookData
            );

            // ==================================
            // PATCH Request
            // ==================================
            const response =
                await fetch(
                    `${baseUrl}/api/books/${bookId}`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            updatedBookData
                        ),
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                        "Failed to update book."
                );
            }

            // ==================================
            // Success
            // ==================================
            setDone(true);

            setImageFile(null);

            // Update image with
            // final ImgBB URL
            if (
                result.data?.coverImage
            ) {
                setImg(
                    result.data
                        .coverImage
                );
            }

        } catch (error) {
            console.error(
                "Update book error:",
                error
            );

            setError(
                error?.message ||
                    "Failed to update book. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // Loading
    // ==========================================
    if (
        loading ||
        sessionLoading
    ) {
        return (
            <Shell>
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">

                        <Loader2
                            className="mx-auto animate-spin text-[#5b4bdb]"
                            size={32}
                        />

                        <p className="mt-3 text-sm font-semibold text-slate-500">
                            Loading book information...
                        </p>

                    </div>
                </div>
            </Shell>
        );
    }

    // ==========================================
    // Main UI
    // ==========================================
    return (
        <Shell>

            {/* ================================
                Header
            ================================= */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-black">
                        Edit Book
                    </h1>

                    <p className="mt-1 text-xs text-slate-500">
                        Update your book information.
                    </p>
                </div>

                <Link
                    href="/dashboard/librarian/inventory"
                    className="flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                    <ArrowLeft size={15} />

                    Back to Inventory
                </Link>

            </div>

            {/* ================================
                Success
            ================================= */}
            {done && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">

                    <CheckCircle2
                        className="mr-2 inline"
                        size={17}
                    />

                    Book updated successfully.

                </div>
            )}

            {/* ================================
                Error
            ================================= */}
            {error && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
                    {error}
                </div>
            )}

            {/* ================================
                FORM
            ================================= */}
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

                    {/* Quantity + Fee + Category */}
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
                            Change Book Cover
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
                                        : "Choose a new book cover"}

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

                    {/* Save */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex w-full items-center justify-center rounded-lg bg-[#5b4bdb] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4d3fc4] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {saving ? (
                            <>
                                <Loader2
                                    className="mr-2 animate-spin"
                                    size={17}
                                />

                                {imageFile
                                    ? "Uploading & Saving..."
                                    : "Saving Changes..."}
                            </>
                        ) : (
                            "Save Changes"
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
                                onClick={
                                    handleRemoveImage
                                }
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
                                alt={
                                    formData.title ||
                                    "Book cover preview"
                                }
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
                        Select a new image only if you
                        want to replace the existing cover.
                    </p>

                </div>

            </form>

        </Shell>
    );
}
