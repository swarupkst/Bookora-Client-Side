export default function HomePage() {
  return (
    <main className="min-h-screen bg-base-100">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Bookora
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Your Local Library,
            <br />
            <span className="text-primary">
              Delivered
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base-content/70 sm:text-lg">
            Discover books from local libraries and
            independent book owners and get them
            delivered to your doorstep.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="btn btn-primary">
              Browse Books
            </button>

            <button className="btn btn-outline">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}