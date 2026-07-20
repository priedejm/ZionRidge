import { Link } from "@tanstack/react-router";
import zrdLogo from "@/assets/zrd-logo.svg";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--cream)]/15 bg-[var(--green-dark)] text-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <img
              src={zrdLogo}
              alt="Zion Ridge Development"
              className="h-10 w-auto [filter:brightness(0)_invert(1)] opacity-95"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--cream)]/70">
              Real estate development built for investors who expect more.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.22em] text-[var(--cream)]/60">
              Navigate
            </h4>
            <ul className="mt-5 space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/projects", label: "Projects" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.22em] text-[var(--cream)]/60">
              Contact
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-[var(--cream)]/85">
              <li>invest@zionridgedev.com</li>
              <li>Greenville, SC</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--cream)]/15 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--cream)]/55">
              &copy; {new Date().getFullYear()} Zion Ridge Development. All rights reserved.
            </p>
            <p className="max-w-2xl text-xs leading-relaxed text-[var(--cream)]/45">
              This site is for informational purposes only and does not constitute an offer to sell
              or a solicitation of an offer to buy any security. Investments involve risk including
              loss of principal.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}