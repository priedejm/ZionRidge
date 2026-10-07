import { createFileRoute } from "@tanstack/react-router";
import { LinkButton } from "@/components/site/Button";
import { Reveal } from "@/components/site/Reveal";
import { useSiteImages, type SiteImageSlot } from "@/lib/siteImages";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Zion Ridge Development" },
      { name: "description", content: "Zion Ridge is an Upstate South Carolina real estate development firm with a long-term, owner-operator approach." },
      { property: "og:title", content: "About - Zion Ridge Development" },
      { property: "og:description", content: "Greenville, SC-area real estate development with a long-term, owner-operator approach." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  { t: "Owner-Operator", b: "We invest our own capital in every project we sponsor. Our outcomes are tied to yours." },
  { t: "Long-Term Horizon", b: "We underwrite for durable value, not quick exits or fee extraction." },
  { t: "Disciplined Underwriting", b: "Conservative assumptions, multiple downside cases, and zero reliance on cap-rate compression." },
  { t: "Hands-On Execution", b: "Land, design, engineering, and entitlement are run by our team - not handed off." },
];

type Credential = { degree: string; school: string };

type TeamMember = {
  name: string;
  role: string;
  initials: string;
  photoSlot: SiteImageSlot;
  credentials?: Credential[];
};

const team: TeamMember[] = [
  {
    name: "John Kanaan",
    role: "President / Owner",
    initials: "JK",
    photoSlot: "team-john",
    credentials: [
      { degree: "Bachelor of Science in Business Administration, Business Management", school: "University of South Carolina" },
      { degree: "Master of Real Estate Development (MRED)", school: "Clemson University" },
    ],
  },
  {
    name: "Raley Bruce",
    role: "Operations Coordinator",
    initials: "RB",
    photoSlot: "team-raley",
    credentials: [
      { degree: "Bachelor of Arts in Interdisciplinary Studies", school: "University of South Carolina Upstate" },
    ],
  },
];

function AboutPage() {
  const siteImages = useSiteImages();

  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
          <Reveal as="p" className="font-display text-xs uppercase tracking-[0.32em] text-[var(--cream)]/65">
            About
          </Reveal>
          <Reveal as="h1" delay={120} blur className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            We develop the kind of land we&rsquo;d want to own.
          </Reveal>
          <Reveal as="p" delay={260} className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--cream)]/75">
            Zion Ridge Development is a land development firm focused on the
            Upstate of South Carolina. We acquire land, design and entitle communities, and deliver
            fully developed lots to the builders who bring them to life - with our own capital alongside our partners&rsquo;.
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-[var(--cream)] text-[var(--green-dark)]">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2">
          <Reveal className="space-y-6">
            <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--green-dark)]/60">
              Our Story
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              A land development firm built by operators, for investors.
            </h2>
            <p className="text-base leading-relaxed text-[var(--green-dark)]/80">
              Zion Ridge was founded by land developers and capital allocators who were tired of watching
              fees compound while project economics quietly eroded. We started Zion Ridge to do it
              differently: identify the right land in the right markets, hold it through
              entitlement, and deliver fully developed lots we&rsquo;re proud to put our own names on.
            </p>
            <p className="text-base leading-relaxed text-[var(--green-dark)]/80">
              Today we operate across Greenville, Greer, Travelers Rest, Spartanburg, and Anderson, with a portfolio that spans
              estate-lot communities, subdivision developments, townhome-ready sites, and conservation
              land holdings. Once a project is fully developed, we hand it off to trusted builders to bring
              to completion. Every project we sponsor includes meaningful sponsor co-invest.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--green-dark)]/60">
              What We Stand For
            </p>
            <ul className="mt-8 space-y-8">
              {values.map((v, i) => (
                <Reveal as="li" key={v.t} delay={i * 100} className="border-t border-[var(--green-dark)]/15 pt-6">
                  <h3 className="font-display text-xl font-semibold">{v.t}</h3>
                  <p
                    className="mt-2 text-sm leading-relaxed text-[var(--green-dark)]/75"
                    dangerouslySetInnerHTML={{ __html: v.b }}
                  />
                </Reveal>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal as="p" className="font-display text-xs uppercase tracking-[0.28em] text-[var(--cream)]/60">
            The Team
          </Reveal>
          <Reveal as="h2" delay={120} className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            The operators behind every project.
          </Reveal>

          <div className="mt-16 grid max-w-3xl gap-6 sm:grid-cols-2">
            {team.map((m, i) => {
              const photo = siteImages.src(m.photoSlot);
              return (
                <Reveal key={m.name} delay={i * 100} className="border border-[var(--cream)]/15 p-6">
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-[var(--green-mid)]">
                    {photo ? (
                      <img src={photo} alt={m.name} className="h-full w-full object-cover" />
                    ) : siteImages.ready ? (
                      <span className="font-display text-5xl font-semibold text-[var(--cream)]/70">
                        {m.initials}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{m.name}</h3>
                  <p className="mt-1 font-display text-[11px] uppercase tracking-[0.22em] text-[var(--cream)]/60">
                    {m.role}
                  </p>
                  {m.credentials && (
                    <ul className="mt-5 space-y-3 border-t border-[var(--cream)]/15 pt-5">
                      {m.credentials.map((c) => (
                        <li key={c.degree}>
                          <p className="text-sm leading-snug text-[var(--cream)]/85">{c.degree}</p>
                          <p className="mt-0.5 text-xs text-[var(--cream)]/55">{c.school}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo + CTA */}
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <div className="relative">
          <img
            src={siteImages.src("about-banner")}
            alt="South Carolina land held by Zion Ridge"
            loading="lazy"
            width={1280}
            height={1280}
            className="kenburns h-[360px] w-full object-cover opacity-50 sm:h-[480px]"
          />
          <Reveal className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-5 text-center">
            <h2 className="font-display text-4xl font-semibold sm:text-6xl">
              Develop with us.
            </h2>
            <LinkButton to="/contact" variant="cream-outline">
              Schedule a Call
            </LinkButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}