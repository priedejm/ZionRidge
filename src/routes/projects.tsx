import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import type { ProjectStatus } from "@/data/projects";
import { useProjects } from "@/lib/listings";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects - Zion Ridge Development" },
      { name: "description", content: "Previous, current, and upcoming real estate developments from Zion Ridge." },
      { property: "og:title", content: "Projects - Zion Ridge Development" },
      { property: "og:description", content: "Track record across previous, current, and upcoming developments." },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

type Filter = "all" | ProjectStatus;
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Active", label: "Active" },
  { id: "Pending", label: "Pending" },
  { id: "Sold", label: "Sold" },
];

function ProjectsPage() {
  const [active, setActive] = useState<Filter>("all");
  const { data, isLoading, isError } = useProjects();
  const projects = data ?? [];
  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.status === active)),
    [active, projects],
  );

  return (
    <>
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
          <Reveal as="p" className="font-display text-xs uppercase tracking-[0.32em] text-[var(--cream)]/65">
            Track Record
          </Reveal>
          <Reveal as="h1" delay={120} blur className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            Land we&rsquo;ve developed, are developing, and will develop next.
          </Reveal>
          <Reveal as="p" delay={260} className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--cream)]/75">
            A selection of our portfolio across the Greenville, SC area - from delivered lots to
            land holdings in pre-development.
          </Reveal>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-[var(--green-dark)]/15 bg-[var(--cream)] text-[var(--green-dark)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-6 sm:px-8">
          {filters.map((f) => {
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                className={cn(
                  "rounded-none border px-5 py-2.5 font-display text-xs uppercase tracking-[0.22em] transition-colors",
                  isActive
                    ? "border-[var(--green-dark)] bg-[var(--green-dark)] text-[var(--cream)]"
                    : "border-[var(--green-dark)]/30 text-[var(--green-dark)] hover:border-[var(--green-dark)]",
                )}
              >
                {f.label}
              </button>
            );
          })}
          <span className="ml-auto font-display text-[11px] uppercase tracking-[0.22em] text-[var(--green-dark)]/60">
            {visible.length} {visible.length === 1 ? "Project" : "Projects"}
          </span>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          {isLoading ? (
            <p className="py-24 text-center text-[var(--cream)]/70">Loading projects…</p>
          ) : isError ? (
            <p className="py-24 text-center text-[var(--cream)]/70">
              Couldn&rsquo;t load projects — try refreshing.
            </p>
          ) : visible.length === 0 ? (
            <p className="py-24 text-center text-[var(--cream)]/70">No projects in this category yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 120}>
                  <ProjectCard project={p} theme="dark" />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}