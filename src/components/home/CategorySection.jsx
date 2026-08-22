import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";

import { categories } from "@/data/homeData";
import SectionHeading from "@/components/ui/SectionHeading";

export default function CategorySection() {
  return (
    <section className="bg-base-100 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="Popular categories"
          description="Find something that matches your mood, curiosity, or goals."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map(
            (category, index) => (
              <Link
                key={category.name}
                href={`/browse?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl transition-transform group-hover:scale-110">
                    {category.icon}
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-base-content/30 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary"
                  />
                </div>

                <div className="mt-8">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
                    0{index + 1}
                  </span>

                  <h3 className="text-xl font-bold sm:text-2xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-base-content/55">
                    {category.description}
                  </p>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}