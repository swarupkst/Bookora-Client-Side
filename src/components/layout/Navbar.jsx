"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const user = session?.user;

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  // ------------------------------------------------------------
  // Role-based Dashboard URL
  // ------------------------------------------------------------

  const getDashboardUrl = () => {
    if (!user) {
      return "/login";
    }

    if (user.role === "admin") {
      return "/dashboard/admin";
    }

    if (user.role === "librarian") {
      return "/dashboard/librarian";
    }

    return "/dashboard/user";
  };

  async function handleLogout() {
    await authClient.signOut();

    setMobileOpen(false);

    window.location.href = "/";
  }

  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Browse Books",
      href: "/browse",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/95 backdrop-blur">
      <div className="navbar mx-auto min-h-18 max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            Logo
        ====================================================== */}

        <div className="navbar-start">
          <Link
            href="/"
            className="group flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-sm transition-transform group-hover:rotate-[-5deg]">
              <BookOpen size={22} />
            </div>

            <div>
              <span className="block text-xl font-black tracking-tight">
                Bookora
              </span>

              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/45 sm:block">
                Read. Borrow. Discover.
              </span>
            </div>
          </Link>
        </div>

        {/* =====================================================
            Desktop Navigation
        ====================================================== */}

        <div className="navbar-center hidden lg:flex">
          <nav className="flex items-center gap-1">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* =================================================
                Role-Based Dashboard
                No Dropdown
            ================================================= */}

            {user && (
              <Link
                href={getDashboardUrl()}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  pathname.startsWith("/dashboard")
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                Dashboard
              </Link>
            )}

          </nav>
        </div>

        {/* =====================================================
            Desktop Auth
        ====================================================== */}

        <div className="navbar-end hidden gap-2 lg:flex">

          {/* Not Logged In */}

          {!isPending && !user && (
            <>
              <Link
                href="/login"
                className="btn btn-ghost btn-sm px-4"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="btn btn-primary btn-sm rounded-xl px-5"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Logged In */}

          {!isPending && user && (
            <div className="dropdown dropdown-end">

              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost gap-2 rounded-xl"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle size={26} />
                )}

                <span className="max-w-28 truncate">
                  {user.name}
                </span>

                <ChevronDown size={15} />
              </div>

              {/* Profile Dropdown Only */}

              <ul
                tabIndex={0}
                className="menu dropdown-content z-[60] mt-2 w-56 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"
              >

                <li>
                  <Link href={getDashboardUrl()}>
                    Dashboard
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error"
                  >
                    Logout
                  </button>
                </li>

              </ul>
            </div>
          )}
        </div>

        {/* =====================================================
            Mobile Menu Button
        ====================================================== */}

        <div className="navbar-end lg:hidden">
          <button
            className="btn btn-square btn-ghost"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

      </div>

      {/* =======================================================
          Mobile Menu
      ======================================================== */}

      {mobileOpen && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">

          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">

            {/* Main Links */}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`block rounded-xl px-4 py-3 font-semibold ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-200"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* =================================================
                Single Role-Based Dashboard Link
            ================================================= */}

            {user && (
              <>
                <Link
                  href={getDashboardUrl()}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={`block rounded-xl px-4 py-3 font-semibold ${
                    pathname.startsWith("/dashboard")
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-base-200"
                  }`}
                >
                  Dashboard
                </Link>

                {/* Logout */}

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-3 text-left font-semibold text-error hover:bg-error/10"
                >
                  Logout
                </button>
              </>
            )}

            {/* =================================================
                Login / Register
            ================================================= */}

            {!user && !isPending && (
              <div className="grid grid-cols-2 gap-2 pt-3">

                <Link
                  href="/login"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="btn btn-outline rounded-xl"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="btn btn-primary rounded-xl"
                >
                  Register
                </Link>

              </div>
            )}

          </nav>
        </div>
      )}
    </header>
  );
}
