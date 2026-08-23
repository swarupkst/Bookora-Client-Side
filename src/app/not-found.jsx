import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-5">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <BookOpen size={36} />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          404
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base-content/60">
          The page you're looking for doesn't
          exist or may have been moved.
        </p>

        <Link
          href="/"
          className="btn btn-primary mt-8 rounded-xl px-7"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}