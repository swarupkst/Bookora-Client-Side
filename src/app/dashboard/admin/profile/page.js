"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Camera, Save, ShieldCheck } from "lucide-react";

const defaultProfile = {
  name: "BookOra Admin",
  email: "admin@gmail.com",
  phone: "+880 1XXXXXXXXX",
  role: "Administrator",
  bio: "Responsible for platform moderation, book approvals and user management.",
  image: ""
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bookora-admin-profile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, image: reader.result }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem("bookora-admin-profile", JSON.stringify(profile));
    setSaved(true);
  }

  return (
    <AdminShell
      title="Admin Profile"
      subtitle="Update your profile information. This demo stores changes in localStorage."
    >
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Admin profile"
                  className="h-28 w-28 rounded-2xl object-cover"
                />
              ) : (
                <div className="grid h-28 w-28 place-items-center rounded-2xl bg-violet-100 text-3xl font-extrabold text-violet-700">
                  AD
                </div>
              )}

              <label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-violet-600 text-white shadow-lg">
                <Camera size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>

            <h2 className="mt-5 text-xl font-bold text-zinc-900">{profile.name}</h2>
            <p className="text-sm text-zinc-500">{profile.email}</p>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
              <ShieldCheck size={15} />
              {profile.role}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-bold text-zinc-900">Profile Information</h2>
          <p className="mt-1 text-sm text-zinc-500">Edit your basic administrator information.</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">Full Name</span>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-violet-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">Email</span>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-violet-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">Phone</span>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-violet-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">Role</span>
              <input
                value={profile.role}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-500"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-zinc-700">Bio</span>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows="4"
                className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-violet-500"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700"
            >
              <Save size={17} />
              Save Changes
            </button>

            {saved && (
              <span className="text-sm font-semibold text-emerald-600">
                Profile saved successfully.
              </span>
            )}
          </div>
        </section>
      </form>
    </AdminShell>
  );
}
