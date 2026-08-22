import {
  BookOpen,
  MapPin,
  Users,
  Truck,
} from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "2,500+",
    label: "Books available",
  },
  {
    icon: Users,
    value: "850+",
    label: "Readers",
  },
  {
    icon: MapPin,
    value: "120+",
    label: "Local providers",
  },
  {
    icon: Truck,
    value: "4,800+",
    label: "Books delivered",
  },
];

export default function HomeStats() {
  return (
    <section className="border-y border-base-300 bg-base-100">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-base-300 md:grid-cols-4 md:divide-y-0">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 px-5 py-7 sm:px-8"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={20} />
              </div>

              <div>
                <p className="text-xl font-black sm:text-2xl">
                  {stat.value}
                </p>

                <p className="text-xs font-medium text-base-content/50 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}