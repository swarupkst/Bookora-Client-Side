import Link from "next/link";
import Image from "next/image";
import {
    ArrowUpRight,
    Truck,
} from "lucide-react";

export default function BookCard({
    book,
}) {
    const unavailable =
        book.status !== "Available";

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[4/5] overflow-hidden bg-base-200">
                {book.image ? (
                    <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-200">
                        <div className="text-center">
                            <div className="text-4xl">
                                📚
                            </div>

                            <p className="mt-2 text-xs font-semibold text-base-content/40">
                                No Cover Image
                            </p>
                        </div>
                    </div>
                )}

                <div className="absolute left-3 top-3">
                    <span className="badge border-0 bg-base-100/90 px-3 py-3 text-xs font-semibold shadow-sm backdrop-blur">
                        {book.category}
                    </span>
                </div>

                {unavailable && (
                    <div className="absolute right-3 top-3">
                        <span className="badge badge-error px-3 py-3 text-xs font-bold text-white">
                            Unavailable
                        </span>
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link
                        href={`/books/${book.id}`}
                        className="btn btn-sm w-full rounded-lg bg-white text-black hover:bg-white/90"
                    >
                        View Details
                        <ArrowUpRight size={15} />
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-lg font-bold leading-tight">
                    {book.title}
                </h3>

                <p className="mt-2 text-sm text-base-content/55">
                    by {book.author}
                </p>

                <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-3 border-t border-base-200 pt-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold">
                            <Truck
                                size={16}
                                className="text-primary"
                            />
                            ৳{book.deliveryFee}
                        </div>

                        <span
                            className={`text-xs font-semibold ${
                                unavailable
                                    ? "text-error"
                                    : "text-success"
                            }`}
                        >
                            {book.status}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}