import Link from "next/link";
import {
  FaYoutube,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Bookora
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Unlock the joy of reading with Bookora. Browse diverse collections from local providers and enjoy secure, fast delivery right to your door.
            </p>

            <div className="mt-6 flex items-center gap-4">
  <Link
    href="https://x.com"
    target="_blank"
    className="rounded-lg border border-slate-700 p-2 transition hover:border-sky-500 hover:text-white"
  >
    <FaXTwitter className="h-5 w-5" />
  </Link>

  <Link
    href="https://youtube.com"
    target="_blank"
    className="rounded-lg border border-slate-700 p-2 transition hover:border-sky-500 hover:text-white"
  >
    <FaYoutube  className="h-5 w-5" />
  </Link>

  <Link
    href="https://instagram.com"
    target="_blank"
    className="rounded-lg border border-slate-700 p-2 transition hover:border-sky-500 hover:text-white"
  >
    <FaInstagram  className="h-5 w-5" />
  </Link>

  <Link
    href="https://facebook.com"
    target="_blank"
    className="rounded-lg border border-slate-700 p-2 transition hover:border-sky-500 hover:text-white"
  >
    <FaFacebookF className="h-5 w-5" />
  </Link>
</div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-sky-400"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-sky-400"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="transition hover:text-sky-400"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Newsletter
            </h3>

            <p className="mb-4 text-sm text-slate-400">
              Subscribe to receive the latest updates.
            </p>

            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
              />

              <button
  type="button"
  className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-500 cursor-pointer"
>
  Subscribe
  <IoSend className="text-lg" />
</button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {year} Bookora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}