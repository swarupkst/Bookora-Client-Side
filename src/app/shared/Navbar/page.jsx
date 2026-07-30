"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Books", href: "/browse" },
];

// Dashboard dropdown content changes based on the logged-in user's role
const DASHBOARD_MENU = {
  user: [
    { label: "Overview", href: "/dashboard/user" },
    { label: "Delivery History", href: "/dashboard/user/history" },
    { label: "My Reading List", href: "/dashboard/user/reading-list" },
    { label: "My Reviews", href: "/dashboard/user/reviews" },
  ],
  librarian: [
    { label: "Overview", href: "/dashboard/librarian" },
    { label: "Add Book", href: "/dashboard/librarian/add-book" },
    { label: "Manage Inventory", href: "/dashboard/librarian/inventory" },
    { label: "Manage Deliveries", href: "/dashboard/librarian/deliveries" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Book Approval Queue", href: "/dashboard/admin/approvals" },
    { label: "Manage Users", href: "/dashboard/admin/users" },
    { label: "Manage All Books", href: "/dashboard/admin/books" },
    { label: "Transactions", href: "/dashboard/admin/transactions" },
  ],
};

/**
 * <Navbar session={{ name: "Rafiq", role: "librarian" }} onLogout={handleLogout} />
 * Pass session={null} for a logged-out visitor.
 */
export default function Navbar({ session = null, onLogout = () => {} }) {
  const pathname = usePathname();
  const role = session?.role;
  const dashboardItems = role ? DASHBOARD_MENU[role] ?? [] : [];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [mobileDashOpen, setMobileDashOpen] = useState(false);
  const dashRef = useRef(null);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // close desktop dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dashRef.current && !dashRef.current.contains(e.target)) {
        setDashOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // close mobile menu whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
    setMobileDashOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#1E2A44] text-[#FBF6EB]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo — left side, links to Home */}
        <Link href="/" className="flex shrink-0 items-center gap-2 text-2xl font-bold">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 4.5C3 3.67 3.67 3 4.5 3H11V21H4.5C3.67 21 3 20.33 3 19.5V4.5Z" fill="#C08A3E" />
            <path d="M13 3H19.5C20.33 3 21 3.67 21 4.5V19.5C21 20.33 20.33 21 19.5 21H13V3Z" fill="#F2E8D5" />
          </svg>
          Bookora
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative pb-1 text-sm font-medium transition-colors ${
                isActive(link.href) ? "text-[#D8A85C]" : "text-[#D9CFB8] hover:text-[#FBF6EB]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded bg-[#D8A85C]" />
              )}
            </Link>
          ))}

          {/* Dashboard — only shown once a role is known, dropdown content depends on role */}
          {role && (
            <div className="relative" ref={dashRef}>
              <button
                onClick={() => setDashOpen((o) => !o)}
                aria-expanded={dashOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 pb-1 text-sm font-medium transition-colors ${
                  isActive("/dashboard") ? "text-[#D8A85C]" : "text-[#D9CFB8] hover:text-[#FBF6EB]"
                }`}
              >
                Dashboard
                <ChevronDown size={15} className={`transition-transform ${dashOpen ? "rotate-180" : ""}`} />
              </button>
              {isActive("/dashboard") && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded bg-[#D8A85C]" />
              )}

              {dashOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-lg bg-white text-[#2A2420] shadow-xl">
                  <div className="border-b border-[#EADFC7] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#6E2C3B]">
                    {role} dashboard
                  </div>
                  {dashboardItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDashOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-[#F2E8D5]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Login / Logout */}
          {session ? (
            <button
              onClick={onLogout}
              className="rounded-md bg-[#C08A3E] px-5 py-2 text-sm font-bold text-[#141D30] transition-colors hover:bg-[#D8A85C]"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-[#C08A3E] px-5 py-2 text-sm font-bold text-[#141D30] transition-colors hover:bg-[#D8A85C]"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile panel */}
      <div
        className={`overflow-hidden transition-[max-height] duration-300 md:hidden ${
          mobileOpen ? "max-h-[520px]" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 pb-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                isActive(link.href) ? "bg-[#141D30] text-[#D8A85C]" : "text-[#D9CFB8]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {role && (
            <div>
              <button
                onClick={() => setMobileDashOpen((o) => !o)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive("/dashboard") ? "bg-[#141D30] text-[#D8A85C]" : "text-[#D9CFB8]"
                }`}
              >
                Dashboard
                <ChevronDown size={15} className={`transition-transform ${mobileDashOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileDashOpen && (
                <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-[#2E3C5C] pl-3">
                  {dashboardItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-md px-3 py-2 text-sm text-[#B9AF98] hover:text-[#FBF6EB]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-2 border-t border-[#2E3C5C] pt-3">
            {session ? (
              <button
                onClick={onLogout}
                className="w-full rounded-md bg-[#C08A3E] px-3 py-2.5 text-sm font-bold text-[#141D30]"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block rounded-md bg-[#C08A3E] px-3 py-2.5 text-center text-sm font-bold text-[#141D30]"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}