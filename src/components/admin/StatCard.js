import { Users, LibraryBig, Truck, Banknote, TrendingUp } from "lucide-react";

const icons = {
  users: Users,
  books: LibraryBig,
  deliveries: Truck,
  revenue: Banknote
};

export default function StatCard({ item }) {
  const Icon = icons[item.type];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700">
          <Icon size={21} />
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
          <TrendingUp size={13} />
          {item.change}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-zinc-500">{item.title}</p>
      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900">{item.value}</h3>
    </div>
  );
}
