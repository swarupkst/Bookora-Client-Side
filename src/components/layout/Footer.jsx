import Link from "next/link";
import {
  BookOpen,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
                <BookOpen size={21} />
              </div>

              <span className="text-2xl font-black">
                Bookora
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
              Connecting readers with local
              libraries and independent book
              owners, one story at a time.
            </p>

            <div className="mt-6 flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="btn btn-circle btn-sm border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Facebook size={16} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="btn btn-circle btn-sm border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Instagram size={16} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="btn btn-circle btn-sm border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Linkedin size={16} />
              </a>

              {/* X logo */}

              <a
                href="#"
                aria-label="X"
                className="btn btn-circle btn-sm border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <span className="text-sm font-bold">
                  𝕏
                </span>
              </a>
            </div>
          </div>

          {/* Quick links */}

          <div>
            <h3 className="font-bold">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/browse"
                  className="transition hover:text-white"
                >
                  Browse Books
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-white"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}

          <div>
            <h3 className="font-bold">
              For the community
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li>
                <Link
                  href="/register"
                  className="transition hover:text-white"
                >
                  Become a reader
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="transition hover:text-white"
                >
                  Become a librarian
                </Link>
              </li>

              <li>
                <Link
                  href="/browse"
                  className="transition hover:text-white"
                >
                  Explore books
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}

          <div>
            <h3 className="font-bold">
              Stay in the loop
            </h3>

            <p className="mt-4 text-sm leading-6 text-white/55">
              Get updates about new books and
              Bookora community news.
            </p>

            <div className="mt-5">
              <div className="join w-full">
                <input
                  type="email"
                  placeholder="Your email"
                  className="input join-item w-full border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />

                <button
                  className="btn join-item btn-primary"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <p className="mt-3 flex items-center gap-2 text-xs text-white/40">
              <Mail size={13} />
              Newsletter coming soon.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7 text-center text-sm text-white/40">
          © {new Date().getFullYear()}{" "}
          Bookora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}