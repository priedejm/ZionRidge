import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const statusStyles: Record<Project["status"], string> = {
  Active: "bg-[var(--green-soft)] text-[var(--cream)]",
  Pending: "bg-transparent text-[var(--cream)] border border-[var(--cream)]/60",
  Sold: "bg-[var(--cream)]/40 text-[var(--green-dark)]",
};

export function ProjectCard({ project, theme = "dark" }: { project: Project; theme?: "dark" | "light" }) {
  const onDark = theme === "dark";
  const gallery = project.images && project.images.length > 1 ? project.images : null;
  const [api, setApi] = useState<CarouselApi>();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSlide(api.selectedScrollSnap());
    api.on("select", () => setSlide(api.selectedScrollSnap()));
  }, [api]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <article
          tabIndex={0}
          role="button"
          className={cn(
            "group flex cursor-pointer flex-col border text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cream)]/60",
            onDark
              ? "border-[var(--cream)]/15 bg-[var(--green-dark)] text-[var(--cream)] hover:border-[var(--cream)]/40"
              : "border-[var(--green-dark)]/15 bg-[var(--cream)] text-[var(--green-dark)] hover:border-[var(--green-dark)]/40",
          )}
        >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          width={1280}
          height={960}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-4 top-4 px-3 py-1 font-display text-[10px] uppercase tracking-[0.22em]",
            statusStyles[project.status],
          )}
        >
          {project.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p
          className={cn(
            "font-display text-[11px] uppercase tracking-[0.22em]",
            onDark ? "text-[var(--cream)]/60" : "text-[var(--green-dark)]/60",
          )}
        >
          {project.location}
        </p>
        <h3 className="font-display text-2xl font-semibold">{project.name}</h3>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed",
            onDark ? "text-[var(--cream)]/75" : "text-[var(--green-dark)]/75",
          )}
        >
          {project.description}
        </p>
        <span
          className={cn(
            "mt-4 font-display text-[11px] uppercase tracking-[0.22em] underline-offset-8 group-hover:underline",
            onDark ? "text-[var(--cream)]/80" : "text-[var(--green-dark)]/80",
          )}
        >
          View Details
        </span>
      </div>
        </article>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-5xl gap-0 overflow-y-auto border-[var(--cream)]/15 bg-[var(--green-dark)] p-0 text-[var(--cream)] sm:rounded-none">
        <div className="relative w-full overflow-hidden">
          {gallery ? (
            <Carousel setApi={setApi} opts={{ loop: true }}>
              <CarouselContent className="ml-0">
                {gallery.map((src, i) => (
                  <CarouselItem key={src} className="pl-0">
                    <img
                      src={src}
                      alt={`${project.name} ${i + 1} of ${gallery.length}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 border-none bg-black/40 text-[var(--cream)] backdrop-blur-sm hover:bg-black/60" />
              <CarouselNext className="right-4 top-1/2 -translate-y-1/2 border-none bg-black/40 text-[var(--cream)] backdrop-blur-sm hover:bg-black/60" />
              <span className="absolute bottom-5 right-5 bg-black/40 px-4 py-1.5 font-display text-sm uppercase tracking-[0.22em] text-[var(--cream)] backdrop-blur-sm">
                {slide + 1} / {gallery.length}
              </span>
            </Carousel>
          ) : (
            <img
              src={project.image}
              alt={project.name}
              className="aspect-[16/9] w-full object-cover"
            />
          )}
          <span
            className={cn(
              "absolute left-5 top-5 px-3 py-1 font-display text-[10px] uppercase tracking-[0.22em]",
              statusStyles[project.status],
            )}
          >
            {project.status}
          </span>
        </div>
        <div className="flex flex-col gap-6 p-8">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.22em] text-[var(--cream)]/60">
              {project.location}
            </p>
            <DialogTitle className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              {project.name}
            </DialogTitle>
            <DialogDescription className="mt-4 text-base leading-relaxed text-[var(--cream)]/80">
              {project.overview ?? project.description}
            </DialogDescription>
          </div>

          {project.specs && project.specs.length > 0 && (
            <dl className="grid grid-cols-2 gap-px border border-[var(--cream)]/15 bg-[var(--cream)]/15 sm:grid-cols-4">
              {project.specs.map((s) => (
                <div key={s.label} className="bg-[var(--green-dark)] p-4">
                  <dt className="font-display text-[10px] uppercase tracking-[0.22em] text-[var(--cream)]/60">
                    {s.label}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <div>
              <p className="font-display text-[11px] uppercase tracking-[0.22em] text-[var(--cream)]/60">
                Highlights
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--cream)]/85">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden className="mt-2 inline-block h-px w-4 flex-shrink-0 bg-[var(--cream)]/50" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}