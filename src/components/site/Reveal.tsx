import { useEffect, useRef, useState, type ReactNode, type ElementType, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  blur?: boolean;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
};

export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  blur = false,
  className,
  style,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      className={cn(blur ? "reveal reveal-blur" : "reveal", visible && "is-visible", className)}
      style={{ ...style, ["--reveal-delay" as never]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}