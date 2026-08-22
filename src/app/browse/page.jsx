import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/ui/BookCard";
import { featuredBooks } from "@/data/homeData";

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-base-200/40">
      <Navbar />

      <main>
        {/* Header */}

        <section className="border-b border-base-300 bg-base-100">
          <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Bookora Collection
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Browse Books
            </h1>

            <p className="mt-4 max-w-2xl text-base-content/60">
              Explore books from local libraries
              and independent book owners.
            </p>
          </div>
        </section>

        {/* Filters */}

        <section className="border-b border-base-300 bg-base-100">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 md:flex-row lg:px-8">
            <label className="input input-bordered flex flex-1 items-center gap-2 rounded-xl">
              <Search
                size={18}
                className="text-base-content/40"
              />

              <input
                type="search"
                placeholder="Search by book name..."
                className="grow"
              />
            </label>

            <select className="select select-bordered rounded-xl">
              <option>
                All Categories
              </option>
              <option>Fiction</option>
              <option>Sci-Fi</option>
              <option>Academic</option>
              <option>Programming</option>
              <option>Biography</option>
            </select>

            <select className="select select-bordered rounded-xl">
              <option>
                Availability
              </option>
              <option>Available</option>
              <option>Checked Out</option>
            </select>

            <button className="btn btn-outline rounded-xl">
              <SlidersHorizontal
                size={17}
              />
              Filters
            </button>
          </div>
        </section>

        {/* Books */}

        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="mb-7 flex items-center justify-between">
            <p className="text-sm font-semibold text-base-content/60">
              Showing{" "}
              <span className="text-base-content">
                {featuredBooks.length}
              </span>{" "}
              books
            </p>

            <select className="select select-sm select-bordered rounded-lg">
              <option>Newest first</option>
              <option>Delivery fee: Low to high</option>
              <option>Delivery fee: High to low</option>
              <option>Title: A-Z</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featuredBooks.map(
              (book) => (
                <BookCard
                  key={book.id}
                  book={book}
                />
              )
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}