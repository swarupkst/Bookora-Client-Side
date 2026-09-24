"use client";

import { useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
} from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";

export default function TopLibrarians() {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const response = await fetch(
          "/api/librarians",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        console.log("Librarians API response:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch librarians"
          );
        }

        setLibrarians(data);
      } catch (error) {
        console.error(
          "Librarian fetch error:",
          error
        );

        setLibrarians([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrarians();
  }, []);

  return (
    <section className="bg-base-200/50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Section Heading */}
        <SectionHeading
          eyebrow="Our Community"
          title="Top librarians"
          description="Meet some of the trusted people helping readers discover and receive great books."
          center
        />

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-base-300 bg-base-100 p-7 text-center shadow-sm"
              >
                <div className="mx-auto mb-5 h-24 w-24 animate-pulse rounded-full bg-base-300" />

                <div className="mx-auto h-6 w-32 animate-pulse rounded bg-base-300" />

                <div className="mx-auto mt-3 h-4 w-28 animate-pulse rounded bg-base-300" />

                <div className="mt-6 h-20 animate-pulse rounded-2xl bg-base-200" />
              </div>
            ))}
          </div>
        ) : librarians.length === 0 ? (
          /* Empty State */
          <div className="py-10 text-center">
            <p className="text-base-content/60">
              No librarians found.
            </p>
          </div>
        ) : (
          /* Librarian Cards */
          <div className="grid gap-5 md:grid-cols-3">
            {librarians.map((librarian) => (
              <div
                key={librarian._id}
                className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Award Icon */}
                <div className="absolute right-5 top-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Award size={18} />
                  </div>
                </div>

                {/* Profile Image */}
                <div className="mx-auto mb-5 w-fit rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-1">
                  <div className="relative h-24 w-24">

                    {librarian.image ? (
                      <img
                        src={librarian.image}
                        alt={
                          librarian.name ||
                          "Librarian"
                        }
                        className="h-24 w-24 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          const fallback =
                            e.currentTarget
                              .nextElementSibling;

                          if (fallback) {
                            fallback.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}

                    {/* Fallback Avatar */}
                    <div
                      className={`${
                        librarian.image
                          ? "hidden"
                          : "flex"
                      } absolute inset-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-content`}
                    >
                      {librarian.name
                        ?.charAt(0)
                        ?.toUpperCase() || "L"}
                    </div>

                    {/* Fallback for Invalid Image */}
                    {librarian.image && (
                      <div
                        className="absolute inset-0 hidden items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-content"
                      >
                        {librarian.name
                          ?.charAt(0)
                          ?.toUpperCase() || "L"}
                      </div>
                    )}

                  </div>
                </div>

                {/* Librarian Name */}
                <h3 className="text-xl font-bold">
                  {librarian.name ||
                    "Librarian"}
                </h3>

                {/* Trusted Provider */}
                <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-success">
                  <CheckCircle2 size={15} />
                  Trusted provider
                </div>

                {/* Completed Deliveries */}
                <div className="mt-6 rounded-2xl bg-base-200 p-4">
                  <p className="text-2xl font-black">
                    0
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Completed deliveries
                  </p>
                </div>

                {/* Rating */}
                <div className="mt-5 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <span
                        key={star}
                        className="text-sm text-warning"
                      >
                        ★
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}