const items = [
  { value: "27", label: "Projects Completed" },
  { value: "1,840", label: "Acres Acquired" },
  { value: "12", label: "Active Developments" },
  { value: "180+", label: "Investors Partnered" },
];

export function StatTicker() {
  const track = [...items, ...items, ...items, ...items];
  return (
    <section
      aria-label="Company statistics"
      className="overflow-hidden border-y border-[var(--cream)]/15 bg-[var(--green-mid)] py-6"
    >
      <div className="marquee-track flex w-max items-center gap-16 whitespace-nowrap">
        {track.map((s, i) => (
          <div key={i} className="flex items-baseline gap-4">
            <span className="font-display text-3xl font-semibold text-[var(--cream)] sm:text-4xl">
              {s.value}
            </span>
            <span className="font-display text-xs uppercase tracking-[0.22em] text-[var(--cream)]/70">
              {s.label}
            </span>
            <span className="mx-8 h-2 w-2 rounded-full bg-[var(--cream)]/40" aria-hidden />
          </div>
        ))}
      </div>
    </section>
  );
}