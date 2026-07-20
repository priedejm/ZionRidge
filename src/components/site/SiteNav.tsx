import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import zrdLogo from "@/assets/zrd-logo.svg";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cream)]/15 bg-[var(--green-dark)]/95 backdrop-blur">
      <nav className="flex h-20 items-center justify-between pl-8 pr-5 sm:pl-12 sm:pr-8 lg:pl-20 lg:pr-12">
        <Link to="/" className="flex items-center" aria-label="Zion Ridge Development home">
          <img
            src={zrdLogo}
            alt="Zion Ridge Development"
            className="h-12 w-auto [filter:brightness(0)_invert(1)] opacity-95"
            width={200}
            height={100}
          />
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="group relative inline-flex flex-col items-center font-display text-sm uppercase tracking-[0.18em] text-[var(--cream)]/70 transition-colors duration-200 hover:text-[var(--cream)]"
                activeProps={{ className: "text-[var(--cream)]" }}
              >
                {({ isActive }) => (
                  <>
                    <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                      {l.label}
                    </span>
                    <span
                      className={`pointer-events-none absolute -bottom-2 left-0 h-[2px] bg-[var(--cream)] transition-all duration-300 ease-out ${
                        isActive
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"
                      }`}
                    />
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-[var(--cream)]"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[var(--cream)]/15 bg-[var(--green-dark)]">
          <ul className="mx-auto flex max-w-7xl flex-col px-5 py-4">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block border-l-2 border-transparent py-3 pl-3 font-display text-base uppercase tracking-[0.18em] text-[var(--cream)]/70 transition-colors"
                  activeProps={{
                    className:
                      "block border-l-2 border-[var(--cream)] py-3 pl-3 font-display text-base uppercase tracking-[0.18em] text-[var(--cream)] bg-[var(--cream)]/5",
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}