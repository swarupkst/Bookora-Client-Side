"use client";

import { useEffect, useState } from "react";
import {
    Camera,
    Save,
    Loader2,
    Mail,
    UserRound,
    ShieldCheck,
    UserCircle2,
} from "lucide-react";
import Shell from "@/components/user/Shell";
import { authClient } from "@/app/lib/auth-client";

export default function Page() {
    const {
        data: session,
        isPending,
    } = authClient.useSession();

    const user = session?.user;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState(
        "https://i.pravatar.cc/150"
    );

    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;

        setName(user.name || "");
        setEmail(user.email || "");

        setPhoto(
            user.image ||
                "https://i.pravatar.cc/150"
        );
    }, [user]);

    function upload(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        setError("");
        setSaved(false);

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file."
            );
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image size cannot exceed 5MB."
            );
            return;
        }

        setImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setPhoto(previewUrl);
    }

    async function uploadImageToImgBB(file) {
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
    }

    async function save(event) {
        event.preventDefault();

        setSaving(true);
        setSaved(false);
        setError("");

        try {
            if (!user) {
                throw new Error(
                    "Please login to update your profile."
                );
            }

            const trimmedName =
                name.trim();

            if (!trimmedName) {
                throw new Error(
                    "Full name cannot be empty."
                );
            }

            let imageUrl =
                user.image || "";

            if (imageFile) {
                imageUrl =
                    await uploadImageToImgBB(
                        imageFile
                    );
            }

            const {
                error: updateError,
            } =
                await authClient.updateUser({
                    name: trimmedName,
                    image: imageUrl,
                });

            if (updateError) {
                throw new Error(
                    updateError.message ||
                        "Failed to update profile."
                );
            }

            setImageFile(null);
            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 2500);
        } catch (err) {
            console.error(
                "UPDATE PROFILE ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Failed to update profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    if (isPending) {
        return (
            <Shell>
                <div className="flex min-h-[500px] items-center justify-center">
                    <Loader2
                        size={32}
                        className="animate-spin text-violet-600"
                    />
                </div>
            </Shell>
        );
    }

    if (!user) {
        return (
            <Shell>
                <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
                    <UserCircle2
                        size={48}
                        className="mx-auto text-zinc-300"
                    />

                    <h2 className="mt-4 text-xl font-black text-zinc-900">
                        Login Required
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        Please login to view and manage your profile.
                    </p>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-7">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-600">
                            <UserRound size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
                                My Profile
                            </h1>

                            <p className="mt-1 text-sm text-zinc-500">
                                Manage your personal information and profile photo.
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={save}
                    className="grid gap-6 lg:grid-cols-[300px_1fr]"
                >
                    {/* Profile Card */}
                    <aside className="h-fit overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />

                        <div className="-mt-12 px-6 pb-6 text-center">
                            <div className="relative mx-auto h-24 w-24">
                                <img
                                    src={
                                        photo ||
                                        "https://i.pravatar.cc/150"
                                    }
                                    alt={
                                        user.name ||
                                        "Profile"
                                    }
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                                />

                                <label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-2 border-white bg-violet-600 text-white shadow-md transition hover:bg-violet-700">
                                    <Camera size={15} />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={upload}
                                    />
                                </label>
                            </div>

                            <h2 className="mt-4 truncate text-lg font-black text-zinc-900">
                                {name ||
                                    user.name ||
                                    "Reader"}
                            </h2>

                            <p className="mt-1 truncate text-sm text-zinc-500">
                                {user.email}
                            </p>

                            <div className="mx-auto mt-4 flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold capitalize text-violet-700">
                                <ShieldCheck
                                    size={14}
                                />
                                {user.role ||
                                    "Reader"}
                            </div>

                            <p className="mt-5 text-xs leading-5 text-zinc-400">
                                JPG, PNG or WEBP
                                <br />
                                Maximum 5MB
                            </p>
                        </div>
                    </aside>

                    {/* Details Card */}
                    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="border-b border-zinc-100 pb-5">
                            <h2 className="text-lg font-black text-zinc-900">
                                Personal Information
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Keep your account information up to date.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {saved && (
                            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
                                <ShieldCheck
                                    size={17}
                                />
                                Profile updated successfully.
                            </div>
                        )}

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            {/* Full Name */}
                            <label className="block sm:col-span-2">
                                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-700">
                                    <UserRound
                                        size={15}
                                        className="text-violet-500"
                                    />
                                    Full Name
                                </span>

                                <input
                                    className="input w-full"
                                    value={name}
                                    disabled={saving}
                                    placeholder="Enter your full name"
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                />
                            </label>

                            {/* Email */}
                            <label className="block">
                                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-700">
                                    <Mail
                                        size={15}
                                        className="text-violet-500"
                                    />
                                    Email Address
                                </span>

                                <input
                                    className="input w-full bg-zinc-50 text-zinc-500"
                                    type="email"
                                    value={email}
                                    readOnly
                                />

                                <span className="mt-1.5 block text-xs text-zinc-400">
                                    Email cannot be changed here.
                                </span>
                            </label>

                            {/* User ID */}
                            <label className="block">
                                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-700">
                                    <ShieldCheck
                                        size={15}
                                        className="text-violet-500"
                                    />
                                    User ID
                                </span>

                                <input
                                    className="input w-full bg-zinc-50 text-zinc-500"
                                    value={
                                        user.id ||
                                        ""
                                    }
                                    readOnly
                                />

                                <span className="mt-1.5 block text-xs text-zinc-400">
                                    Your unique account identifier.
                                </span>
                            </label>
                        </div>

                        {/* Footer */}
                        <div className="mt-7 flex flex-col gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary bg-blue-600 text-white rounded-2xl cursor-pointer flex items-center justify-center gap-2 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save
                                            size={16}
                                        />
                                        Save Profile
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-zinc-400">
                                Your changes will be saved to your account.
                            </p>
                        </div>
                    </section>
                </form>
            </div>
        </Shell>
    );
}