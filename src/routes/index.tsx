import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/site/Button";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { useProjects } from "@/lib/listings";
import aboutLand from "@/assets/Old Anderson/DJI_20260325145011_0005_D.JPG";
import partnerBuild from "@/assets/Tyger Bridge Road/DJI_20260402110123_0024_D.JPG";
import zrdLogo from "@/assets/zrd-logo.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zion Ridge Development - Driven by Vision. Built for Returns." },
      { name: "description", content: "Real estate development built for investors who expect more. Land acquisition, development, and investor partnerships." },
      { property: "og:title", content: "Zion Ridge Development" },
      { property: "og:description", content: "Real estate development built for investors who expect more." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const platform = [
  {
    label: "01 - Strategy",
    title: "Land Acquisition",
    body: "We secure ridge-line, view, and growth-corridor parcels in markets with hard supply constraints. Disciplined underwriting, off-market deal flow.",
  },
  {
    label: "02 - Execution",
    title: "Development",
    body: "From entitlement through delivery of finished lots, we run land development in-house. Vertically integrated teams keep schedules, budgets, and quality on a single line of sight.",
  },
  {
    label: "03 - Capital",
    title: "Investor Partnerships",
    body: "Direct co-investment alongside qualified partners. Aligned economics, transparent reporting, and a long-term hold mentality on every project we sponsor.",
  },
];

const steps = [
  { n: "01", t: "Reach Out", b: "Tell us about your investment goals, capital availability, and the kind of projects you want exposure to." },
  { n: "02", t: "Review Opportunities", b: "We share active and upcoming projects with full underwriting, market context, and projected returns." },
  { n: "03", t: "Partner With Us", b: "Allocate alongside us with clear terms, transparent reporting, and direct access to the team running the project." },
];

function HomePage() {
  const { data } = useProjects();
  const featured = (data ?? []).filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[83vh] flex-col items-center justify-center overflow-hidden bg-[var(--green-dark)] px-5 text-center text-[var(--cream)] sm:px-8">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-1/4 -right-1/4 h-[70vh] w-[70vh] rounded-full bg-[var(--green-soft)]/25 blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 -left-1/4 h-[50vh] w-[50vh] rounded-full bg-[var(--green-mid)]/25 blur-[100px]"
          aria-hidden
        />

        {/* Ridge-line motif */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-2 h-[42vh] max-h-[26rem] w-full min-w-[900px] sm:bottom-3"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M0 180 L200 120 L380 160 L560 70 L760 140 L960 50 L1160 130 L1360 90 L1440 130 V220 H0 Z"
            fill="var(--cream)"
            opacity="0.07"
          />
        </svg>
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-2 h-[31vh] max-h-[20rem] w-full min-w-[900px] sm:bottom-3"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M0 200 L260 150 L480 190 L700 120 L920 180 L1140 110 L1340 160 L1440 140 V220 H0 Z"
            fill="var(--cream)"
            opacity="0.05"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center px-4 [margin-top:min(-120px,-11vh)]">
          <Reveal
            as="p"
            className="font-display uppercase tracking-[0.3em] text-[var(--cream)]/60 sm:tracking-[0.4em]"
            style={{ fontSize: "clamp(9px, 1.4vh, 12px)" }}
          >
            Real Estate Development &mdash; Greenville, SC
          </Reveal>
          <Reveal blur delay={120} style={{ marginTop: "clamp(0.5rem, 1.8vh, 1.25rem)" }}>
            <img
              src={zrdLogo}
              alt="Zion Ridge Development"
              className="[filter:brightness(0)_invert(1)] opacity-95"
              style={{ width: "min(46vw, 34vh, 480px)" }}
            />
          </Reveal>
          <Reveal
            delay={280}
            as="p"
            className="font-display uppercase tracking-[0.4em] text-[var(--cream)]/80 lg:tracking-[0.45em]"
            style={{ fontSize: "clamp(0.75rem, 2vh, 1.25rem)", marginTop: "clamp(0.5rem, 1.8vh, 1.25rem)" }}
          >
            Driven by Vision. Built for Returns.
          </Reveal>
          <Reveal
            delay={440}
            className="flex flex-col items-center gap-5 sm:flex-row"
            style={{ marginTop: "clamp(0.75rem, 3vh, 2rem)" }}
          >
            <LinkButton to="/projects" variant="cream-outline">
              View Our Projects <ArrowUpRight size={16} />
            </LinkButton>
            <Link
              to="/contact"
              className="font-display text-sm uppercase tracking-[0.22em] text-[var(--cream)]/70 underline-offset-8 transition-colors hover:text-[var(--cream)] hover:underline"
            >
              Schedule a Call
            </Link>
          </Reveal>
        </div>

        {/* Scroll cue - sits in the dense lower body of the mountain fill, not the empty peak area */}
        <Reveal delay={700} className="absolute bottom-[3vh] z-10 flex flex-col items-center gap-2 text-[var(--cream)]/70 sm:bottom-[4vh]">
          <span className="font-display text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px animate-pulse bg-[var(--cream)]/60" />
        </Reveal>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <div className="mx-auto max-w-7xl px-5 pt-6 pb-24 sm:px-8 sm:pt-8 sm:pb-32">
          <div className="grid items-end gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--cream)]/60">
                What We Do
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                A vertically integrated platform for ground-up land development.
              </h2>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {platform.map((p, i) => (
              <Reveal key={p.title} delay={i * 120} className="border border-[var(--cream)]/15 p-10 transition-colors hover:bg-[var(--green-mid)]/40">
                <p className="font-display text-[11px] uppercase tracking-[0.28em] text-[var(--cream)]/60">
                  {p.label}
                </p>
                <h3 className="mt-6 font-display text-2xl font-semibold">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--cream)]/75">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT TEASER - split */}
      <section className="bg-[var(--cream)] text-[var(--green-dark)]">
        <div className="grid md:grid-cols-2">
          <div className="flex items-center px-5 py-20 sm:px-12 md:px-20 md:py-32">
            <Reveal className="max-w-lg">
              <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--green-dark)]/60">
                About Zion Ridge
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Land developers by trade. Investors by discipline.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[var(--green-dark)]/80">
                Zion Ridge is a land development firm focused on the Upstate of South Carolina.
                We acquire, entitle, and develop land we&rsquo;d be proud to own ourselves - handing off
                fully developed lots to the builders who bring them to life - and we put our own capital
                in alongside our partners.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.22em] text-[var(--green-dark)] underline-offset-8 hover:underline"
              >
                Meet the Team <ArrowUpRight size={16} />
              </Link>
            </Reveal>
          </div>
          <div className="relative min-h-[420px] md:min-h-0">
            <img
              src={aboutLand}
              alt="Wooded land in the Zion Ridge portfolio near Greenville, SC"
              loading="lazy"
              width={1280}
              height={1280}
              className="kenburns absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--cream)]/60">
                Featured Projects
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Selected from our active portfolio.
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.22em] text-[var(--cream)] underline-offset-8 hover:underline"
            >
              View All Projects <ArrowUpRight size={16} />
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 140}>
                <ProjectCard project={p} theme="dark" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO PARTNER */}
      <section className="bg-[var(--cream)] text-[var(--green-dark)]">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--green-dark)]/60">
              How to Partner
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Three steps to invest with Zion Ridge.
            </h2>
            <ol className="mt-12 space-y-10">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.n} delay={i * 120} className="grid grid-cols-[auto_1fr] gap-6 border-t border-[var(--green-dark)]/15 pt-8">
                  <span className="font-display text-3xl font-semibold text-[var(--green-dark)]">{s.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{s.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--green-dark)]/75">{s.b}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Reveal>
          <Reveal className="relative aspect-[4/5] w-full overflow-hidden" delay={150}>
            <img
              src={partnerBuild}
              alt="Zion Ridge land in the Upstate of South Carolina"
              loading="lazy"
              width={1280}
              height={1280}
              className="kenburns absolute inset-0 h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <Reveal className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-24 text-center sm:px-8">
          <h2 className="font-display text-4xl font-semibold sm:text-6xl">
            Ready to invest with us?
          </h2>
          <p className="max-w-lg text-base text-[var(--cream)]/75">
            We&rsquo;re selective about who we partner with. If our approach fits yours, let&rsquo;s talk.
          </p>
          <LinkButton to="/contact" variant="cream-outline">
            Schedule a Call <ArrowUpRight size={16} />
          </LinkButton>
        </Reveal>
      </section>
    </>
  );
}
