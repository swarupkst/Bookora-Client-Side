"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { featuredBooks } from "@/data/homeData";
import BookCard from "@/components/ui/BookCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FeaturedBooks() {
  return (
    <section className="bg-base-100 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Featured Collection"
            title="Books worth discovering"
            description="Fresh picks from our local library community."
          />

          <Link
            href="/browse"
            className="group mb-10 hidden items-center gap-2 text-sm font-bold text-primary sm:flex"
          >
            Browse all books
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.6,
          }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        >
          {featuredBooks.map(
            (book, index) => (
              <motion.div
                key={book.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay:
                    index * 0.08,
                  duration: 0.4,
                }}
              >
                <BookCard book={book} />
              </motion.div>
            )
          )}
        </motion.div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/browse"
            className="btn btn-outline w-full rounded-xl"
          >
            Browse all books
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}