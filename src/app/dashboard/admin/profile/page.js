"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
    Camera,
    Save,
    ShieldCheck,
    Loader2,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

export default function AdminProfilePage() {
    const {
        data: session,
        isPending,
    } = authClient.useSession();

    const user = session?.user;

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState(
        "https://i.pravatar.cc/160?img=12"
    );

    const [imageFile, setImageFile] = useState(null);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // Load logged-in admin information
    useEffect(() => {
        if (!user) return;

        setName(user.name || "");
        setPhone(user.phone || "");

        setAvatar(
            user.image ||
                "https://i.pravatar.cc/160?img=12"
        );
    }, [user]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setSaved(false);
        setError("");

        if (name === "name") {
            setName(value);
        }

        if (name === "phone") {
            setPhone(value);
        }
    };

    // Handle profile image
    const handleImage = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setSaved(false);
        setError("");

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

        setAvatar(previewUrl);
    };

    // Upload image to existing ImgBB API
    const uploadImageToImgBB = async (file) => {
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

    // Save profile
    const handleSubmit = async (event) => {
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

            const trimmedPhone =
                phone.trim();

            if (!trimmedName) {
                throw new Error(
                    "Full name cannot be empty."
                );
            }

            let imageUrl =
                user.image || "";

            // Upload new image if selected
            if (imageFile) {
                imageUrl =
                    await uploadImageToImgBB(
                        imageFile
                    );
            }

            // Update Better Auth user
            const {
                error: updateError,
            } =
                await authClient.updateUser({
                    name: trimmedName,
                    phone: trimmedPhone,
                    image: imageUrl,
                });

            if (updateError) {
                throw new Error(
                    updateError.message ||
                        "Failed to update profile."
                );
            }

            setImageFile(null);

            // Show success message
            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 2500);
        } catch (err) {
            console.error(
                "ADMIN PROFILE UPDATE ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Failed to update profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // Loading
    if (isPending) {
        return (
            <AdminShell
                title="Admin Profile"
                subtitle="Loading your profile information..."
            >
                <div className="flex min-h-[400px] items-center justify-center">
                    <Loader2
                        size={30}
                        className="animate-spin text-violet-600"
                    />
                </div>
            </AdminShell>
        );
    }

    // Not logged in
    if (!user) {
        return (
            <AdminShell
                title="Admin Profile"
                subtitle="Manage your administrator profile."
            >
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
                    <p className="font-bold text-red-600">
                        Please login to view your profile.
                    </p>
                </div>
            </AdminShell>
        );
    }

    const role =
        user.role === "admin"
            ? "Administrator"
            : user.role || "Administrator";

    return (
        <AdminShell
            title="Admin Profile"
            subtitle="Update your administrator profile information."
        >
            <form
                onSubmit={handleSubmit}
                className="grid gap-6 xl:grid-cols-3"
            >
                {/* Profile Card */}
                <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={
                                        user.name ||
                                        "Admin profile"
                                    }
                                    className="h-28 w-28 rounded-2xl object-cover"
                                />
                            ) : (
                                <div className="grid h-28 w-28 place-items-center rounded-2xl bg-violet-100 text-3xl font-extrabold text-violet-700">
                                    {(
                                        user.name ||
                                        "AD"
                                    )
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                            )}

                            <label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-violet-600 text-white shadow-lg transition hover:bg-violet-700">
                                <Camera size={18} />

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={
                                        handleImage
                                    }
                                />
                            </label>
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-zinc-900">
                            {name ||
                                user.name ||
                                "Admin"}
                        </h2>

                        <p className="text-sm text-zinc-500">
                            {user.email}
                        </p>

                        <div className="mt-4 flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                            <ShieldCheck
                                size={15}
                            />
                            {role}
                        </div>
                    </div>
                </section>

                {/* Profile Information */}
                <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm xl:col-span-2">
                    <h2 className="text-lg font-bold text-zinc-900">
                        Profile Information
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        Edit your basic administrator information.
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {saved && (
                        <div className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                            Profile saved successfully.
                        </div>
                    )}

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        {/* Full Name */}
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-zinc-700">
                                Full Name
                            </span>

                            <input
                                name="name"
                                value={name}
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-50"
                            />
                        </label>

                        {/* Email */}
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-zinc-700">
                                Email
                            </span>

                            <input
                                type="email"
                                value={
                                    user.email ||
                                    ""
                                }
                                readOnly
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-500 outline-none"
                            />
                        </label>

                        {/* Phone */}
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-zinc-700">
                                Phone
                            </span>

                            <input
                                name="phone"
                                value={phone}
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="+880 1XXXXXXXXX"
                                className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-50"
                            />
                        </label>

                        {/* Role */}
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-zinc-700">
                                Role
                            </span>

                            <input
                                value={role}
                                disabled
                                className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-500"
                            />
                        </label>

                        {/* User ID */}
                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-semibold text-zinc-700">
                                User ID
                            </span>

                            <input
                                value={
                                    user.id ||
                                    ""
                                }
                                disabled
                                className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-500"
                            />
                        </label>
                    </div>

                    {/* Save */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save
                                        size={17}
                                    />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </section>
            </form>
        </AdminShell>
    );
}