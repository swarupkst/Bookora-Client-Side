"use client";

import Shell from "@/components/librarian/Shell";
import { useEffect, useState } from "react";
import {
    Camera,
    Save,
    Loader2,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

export default function Profile() {
    const {
        data: session,
        isPending,
    } = authClient.useSession();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");

    const [imageFile, setImageFile] = useState(null);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const user = session?.user;

    // Load user information from Better Auth session
    useEffect(() => {
        if (!user) return;

        setName(user.name || "");
        setPhone(user.phone || "");
        setAvatar(
            user.image ||
                "https://i.pravatar.cc/160?img=47"
        );
    }, [user]);

    // Handle profile image selection
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setError("");
        setSaved(false);

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        // Maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size cannot exceed 5MB.");
            return;
        }

        setImageFile(file);

        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setAvatar(previewUrl);
    };

    // Upload image to existing ImgBB API
    const uploadImageToImgBB = async (file) => {
        if (!file) {
            return null;
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
            response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
            const text = await response.text();

            console.error(
                "Upload API returned non-JSON:",
                text
            );

            throw new Error(
                "Image upload server returned an invalid response."
            );
        }

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                    "Failed to upload profile image."
            );
        }

        return result.url;
    };

    // Save profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setSaved(false);
        setError("");

        try {
            if (!user) {
                throw new Error(
                    "Please login to update your profile."
                );
            }

            const trimmedName = name.trim();
            const trimmedPhone = phone.trim();

            if (!trimmedName) {
                throw new Error(
                    "Full name cannot be empty."
                );
            }

            let imageUrl = user.image || "";

            // Upload new image if selected
            if (imageFile) {
                imageUrl =
                    await uploadImageToImgBB(
                        imageFile
                    );
            }

            // Update Better Auth user
            const { error: updateError } =
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

            // Remove selected file after successful update
            setImageFile(null);

            setSaved(true);

            // Hide success message after 2 seconds
            setTimeout(() => {
                setSaved(false);
            }, 2000);
        } catch (err) {
            console.error(
                "PROFILE UPDATE ERROR:",
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

    if (isPending) {
        return (
            <Shell>
                <div className="flex min-h-[400px] items-center justify-center">
                    <Loader2
                        className="animate-spin text-[#5b4bdb]"
                        size={30}
                    />
                </div>
            </Shell>
        );
    }

    if (!user) {
        return (
            <Shell>
                <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
                    <p className="font-bold text-red-600">
                        Please login to view your profile.
                    </p>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            {/* Page Header */}
            <div className="mb-7">
                <h1 className="text-3xl font-black text-slate-900">
                    Librarian Profile
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View and manage your profile information.
                </p>
            </div>

            {/* Profile Form */}
            <form
                onSubmit={handleSubmit}
                className="grid gap-6 lg:grid-cols-3"
            >
                {/* Profile Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <div className="relative mx-auto w-fit">
                        <img
                          src={
                              avatar ||
                              user.image ||
                              "https://i.pravatar.cc/160?img=47"
                          }
                          alt={user.name || "Profile"}
                          className="h-32 w-32 rounded-full object-cover"
                      />

                        {/* Avatar Upload */}
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#5b4bdb] p-3 text-white transition hover:bg-[#493bc2]"
                        >
                            <Camera size={17} />

                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={
                                    handleAvatarChange
                                }
                            />
                        </label>
                    </div>

                    <b className="mt-4 block text-slate-900">
                        {name || "User"}
                    </b>

                    <p className="text-sm text-slate-500">
                        {user.role ===
                        "librarian"
                            ? "Librarian"
                            : "User"}
                    </p>
                </div>

                {/* Profile Details */}
                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {saved && (
                        <div className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                            Profile updated successfully.
                        </div>
                    )}

                    {/* Full Name */}
                    <label className="block">
                        <b className="mb-2 block text-sm text-slate-900">
                            Full Name
                        </b>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            disabled={saving}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5b4bdb] focus:ring-2 focus:ring-[#5b4bdb]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                    </label>

                    {/* Email */}
                    <label className="block">
                        <b className="mb-2 block text-sm text-slate-900">
                            Email
                        </b>

                        <input
                            type="email"
                            readOnly
                            value={
                                user.email || ""
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                        />
                    </label>

                    {/* Phone */}
                    <label className="block">
                        <b className="mb-2 block text-sm text-slate-900">
                            Phone
                        </b>

                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value
                                )
                            }
                            disabled={saving}
                            placeholder="+880 1XXXXXXXXX"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5b4bdb] focus:ring-2 focus:ring-[#5b4bdb]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                    </label>

                    {/* User ID */}
                    <label className="block">
                        <b className="mb-2 block text-sm text-slate-900">
                            User ID
                        </b>

                        <input
                            type="text"
                            readOnly
                            value={
                                user.id || ""
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                        />
                    </label>

                    {/* Role */}
                    <label className="block">
                        <b className="mb-2 block text-sm text-slate-900">
                            Role
                        </b>

                        <input
                            type="text"
                            readOnly
                            value={
                                user.role ||
                                "user"
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 capitalize text-slate-500 outline-none"
                        />
                    </label>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-3 font-bold text-white transition hover:bg-[#493bc2] disabled:cursor-not-allowed disabled:opacity-60"
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
                                <Save size={17} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Shell>
    );
}