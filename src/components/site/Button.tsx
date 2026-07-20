import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "cream-outline" | "cream-solid" | "green-solid" | "green-outline";

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-4 font-display text-sm uppercase tracking-[0.2em] transition-colors duration-200 rounded-none";

const variants: Record<Variant, string> = {
  "cream-outline":
    "border border-[var(--cream)] text-[var(--cream)] hover:bg-[var(--cream)] hover:text-[var(--green-dark)]",
  "cream-solid":
    "bg-[var(--cream)] text-[var(--green-dark)] hover:bg-[var(--cream)]/90",
  "green-solid":
    "bg-[var(--green-dark)] text-[var(--cream)] hover:bg-[var(--green-mid)]",
  "green-outline":
    "border border-[var(--green-dark)] text-[var(--green-dark)] hover:bg-[var(--green-dark)] hover:text-[var(--cream)]",
};

type LinkBtnProps = {
  to: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export function LinkButton({ to, variant = "cream-outline", className, children }: LinkBtnProps) {
  return (
    <Link to={to} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}

type BtnProps = ComponentProps<"button"> & { variant?: Variant };

export function SquareButton({ variant = "cream-outline", className, ...rest }: BtnProps) {
  return <button className={cn(base, variants[variant], className)} {...rest} />;
}