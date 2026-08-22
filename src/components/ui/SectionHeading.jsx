export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}) {
  return (
    <div
      className={`mb-10 ${
        center ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-base-content/60">
          {description}
        </p>
      )}
    </div>
  );
}