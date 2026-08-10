
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F4] px-3 py-12">
      <div className="w-full max-w-xl text-center">

        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center">

          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full bg-[#C58B45]/10" />

          {/* Book */}
          <div className="relative flex h-28 w-28 rotate-[-6deg] items-center justify-center rounded-xl border-2 border-[#C58B45]/30 bg-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-14 w-14 text-[#C58B45]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5A2.25 2.25 0 0 1 6.75 17.25H21"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 2.25H21v19.5H6.75A2.25 2.25 0 0 1 4.5 19.5v-15A2.25 2.25 0 0 1 6.75 2.25Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75h7.5M9 10.5h5.25"
              />
            </svg>
          </div>

          {/* Decorative Dots */}
          <span className="absolute right-3 top-7 h-3 w-3 rounded-full bg-[#C58B45]" />
          <span className="absolute bottom-8 left-5 h-2 w-2 rounded-full bg-[#C58B45]/50" />
        </div>

        {/* 404 */}
        <p className="text-7xl font-black tracking-tight text-[#C58B45] sm:text-8xl">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
          This page got lost in the library.
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
          The page you are looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back to the Bookora library.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          {/* Home */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C58B45] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#AD7435] focus:outline-none focus:ring-2 focus:ring-[#C58B45]/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3 9 9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21V12h6v9"
              />
            </svg>

            Back to Home
          </Link>

          {/* Browse Books */}
          <Link
            href="/books"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Browse Books
          </Link>
        </div>

        {/* Brand */}
        <div className="mt-14">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#1F2937]"
          >
            Book<span className="text-[#C58B45]">ora</span>
          </Link>

          <p className="mt-1 text-xs text-gray-400">
            Discover your next great story.
          </p>
        </div>

      </div>
    </main>
  );
}
