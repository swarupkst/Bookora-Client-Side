"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1800&auto=format&fit=crop",
    title: "Your Local Library, Delivered",
    description:
      "Discover thousands of books, borrow your favorites, and enjoy reading from the comfort of your home.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1800&auto=format&fit=crop",
    title: "Explore New Stories Every Day",
    description:
      "From timeless classics to the latest bestsellers, there's always something new waiting for you.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1800&auto=format&fit=crop",
    title: "Knowledge Without Limits",
    description:
      "Browse academic, fiction, technology, and thousands of other books in one place.",
  },
];

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[650px] w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[90vh] min-h-[650px]">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md"
                    >
                      📚 Welcome to Our Digital Library
                    </motion.span>

                    <motion.h1
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="mt-6 text-5xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 max-w-2xl text-lg leading-8 text-gray-200"
                    >
                      {slide.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-10 flex flex-wrap gap-4"
                    >
                      <Link
                        href="/books"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Browse Books
                        <FaArrowRight />
                      </Link>

                      <Link
                        href="/about"
                        className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
                      >
                        Learn More
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}