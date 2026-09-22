
import BookGrid from "@/components/books/BookGrid";

export const metadata = {
  title: "Browse Books | Bookora",
  description:
    "Explore books available on Bookora.",
};

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-base-200/40">
      

      <main>
        <section className="border-b border-base-300 bg-base-100">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Bookora Collection
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Browse Books
            </h1>

            <p className="mt-4 max-w-2xl text-base-content/60">
              Search, filter and discover books
              from local libraries and book owners.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <BookGrid />
        </section>
      </main>

      
    </div>
  );
}