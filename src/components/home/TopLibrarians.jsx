import Image from "next/image";
import {
  Award,
  CheckCircle2,
} from "lucide-react";

import { librarians } from "@/data/homeData";
import SectionHeading from "@/components/ui/SectionHeading";

export default function TopLibrarians() {
  return (
    <section className="bg-base-200/50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Community"
          title="Top librarians"
          description="Meet some of the trusted people helping readers discover and receive great books."
          center
        />

        <div className="grid gap-5 md:grid-cols-3">
          {librarians.map(
            (librarian, index) => (
              <div
                key={librarian.id}
                className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute right-5 top-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Award size={18} />
                  </div>
                </div>

                <div className="mx-auto mb-5 w-fit rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-1">
                  <Image
                    src={librarian.image}
                    alt={librarian.name}
                    width={110}
                    height={110}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold">
                  {librarian.name}
                </h3>

                <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-success">
                  <CheckCircle2 size={15} />
                  Trusted provider
                </div>

                <div className="mt-6 rounded-2xl bg-base-200 p-4">
                  <p className="text-2xl font-black">
                    {librarian.deliveries}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Completed deliveries
                  </p>
                </div>

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
            )
          )}
        </div>
      </div>
    </section>
  );
}