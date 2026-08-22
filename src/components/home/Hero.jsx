"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Your Local Library, Delivered",
    description:
      "Discover books from local libraries and independent book owners, and have them delivered right to your doorstep.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "A New Story Is Waiting",
    description:
      "Explore thousands of stories, discover new authors, and find your next favorite book.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Read More. Go Further.",
    description:
      "Bookora makes local reading simple, convenient, and accessible for everyone.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1800&q=85",
  },
];

export default function Hero() {
  const [active, setActive] =
    useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(
        (current) =>
          (current + 1) % slides.length
      );
    }, 6000);

    return () =>
      clearInterval(timer);
  }, []);

  const previous = () => {
    setActive(
      (current) =>
        (current - 1 + slides.length) %
        slides.length
    );
  };

  const next = () => {
    setActive(
      (current) =>
        (current + 1) % slides.length
    );
  };

  return (
    <section className="relative overflow-hidden bg-neutral-950">
      <div className="relative min-h-[650px] lg:min-h-[720px]">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active === index
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-20 lg:min-h-[720px] lg:px-8">
          <div className="max-w-3xl text-white">
            <motion.div
              key={active}
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <BookOpen size={16} />
                Discover your next story
              </div>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                {slides[active].title}
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                {slides[active].description}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/browse"
                  className="btn btn-primary btn-lg rounded-xl px-7"
                >
                  Browse Books
                  <ArrowRight size={19} />
                </Link>

                <Link
                  href="/browse"
                  className="btn btn-ghost btn-lg rounded-xl border border-white/20 bg-white/10 px-7 text-white hover:bg-white/20 hover:text-white"
                >
                  <Search size={18} />
                  Explore Collection
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Arrows */}

        <div className="absolute bottom-8 right-5 z-20 flex gap-2 lg:right-8">
          <button
            onClick={previous}
            className="btn btn-circle border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={next}
            className="btn btn-circle border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Indicators */}

        <div className="absolute bottom-10 left-5 z-20 flex gap-2 lg:left-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() =>
                setActive(index)
              }
              aria-label={`Go to slide ${
                index + 1
              }`}
              className={`h-1.5 rounded-full transition-all ${
                active === index
                  ? "w-10 bg-primary"
                  : "w-5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}