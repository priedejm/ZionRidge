import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SquareButton } from "@/components/site/Button";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Zion Ridge Development" },
      { name: "description", content: "Get in touch with the Zion Ridge investor relations team." },
      { property: "og:title", content: "Contact - Zion Ridge Development" },
      { property: "og:description", content: "Get in touch with the Zion Ridge investor relations team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <section className="bg-[var(--green-dark)] text-[var(--cream)]">
        <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
          <Reveal as="p" className="font-display text-xs uppercase tracking-[0.32em] text-[var(--cream)]/65">
            Get in Touch
          </Reveal>
          <Reveal as="h1" delay={120} blur className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            Let&rsquo;s talk about your next investment.
          </Reveal>
          <Reveal as="p" delay={260} className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--cream)]/75">
            Tell us a bit about your goals and we&rsquo;ll set up a call with the team.
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--cream)] text-[var(--green-dark)]">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-10">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--green-dark)]/60">
                Investor Relations
              </p>
              <p className="mt-3 font-display text-2xl">invest@zionridgedev.com</p>
            </div>
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--green-dark)]/60">
                Office
              </p>
              <p className="mt-3 text-base leading-relaxed">
                Greenville, SC
              </p>
            </div>
          </Reveal>

          {submitted ? (
            <Reveal className="flex items-center border border-[var(--green-dark)]/20 p-12">
              <div>
                <h2 className="font-display text-3xl font-semibold">Thank you.</h2>
                <p className="mt-4 text-base text-[var(--green-dark)]/75">
                  We&rsquo;ve received your note and will be in touch soon.
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={150}>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                </div>
                <Field label="Company / Fund (optional)" name="company" />
                <div>
                  <label className="font-display text-[11px] uppercase tracking-[0.22em] text-[var(--green-dark)]/60">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="mt-2 w-full border border-[var(--green-dark)]/30 bg-transparent px-4 py-3 text-base text-[var(--green-dark)] outline-none transition-colors focus:border-[var(--green-dark)]"
                  />
                </div>
                <SquareButton type="submit" variant="green-outline">
                  Send Message
                </SquareButton>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-display text-[11px] uppercase tracking-[0.22em] text-[var(--green-dark)]/60">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 w-full border border-[var(--green-dark)]/30 bg-transparent px-4 py-3 text-base text-[var(--green-dark)] outline-none transition-colors focus:border-[var(--green-dark)]"
      />
    </div>
  );
}