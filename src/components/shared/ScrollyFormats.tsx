import { forwardRef, useEffect, useMemo, useRef, useState, type ElementType } from "react";

export type ScrollyStep = {
  tag: string;
  title: string;
  desc: string;
  image: string;
  icon?: ElementType;
};

type Props = {
  steps: ScrollyStep[];
  label: string;
  heading: string;
  intro?: string;
  variant?: "cream" | "navy";
};

/**
 * Scrollytelling à la Sadewa : chaque étape occupe (presque) tout l'écran,
 * avec un gros numéro, une image hero centrée et un bloc de texte.
 * Une seule étape visible à la fois, transitions à l'entrée dans le viewport.
 */
export const ScrollyFormats = ({
  steps,
  label,
  heading,
  intro,
  variant = "cream",
}: Props) => {
  const tokens = useMemo(() => {
    if (variant === "navy") {
      return {
        section: "section-navy",
        title: "text-white",
        intro: "text-white/65",
        number: "text-white/10",
        numberAccent: "hsl(186 79% 47%)",
        cardBorder: "1px solid hsl(228 30% 22%)",
        cardBg: "hsl(228 40% 14%)",
        text: "text-white",
        muted: "text-white/65",
        tag: "text-primary",
        dotInactive: "hsl(228 30% 30%)",
        dotActive: "hsl(186 79% 47%)",
      };
    }
    return {
      section: "section-cream",
      title: "",
      intro: "",
      number: "",
      numberAccent: "hsl(186 79% 47%)",
      cardBorder: "1px solid hsl(228 10% 85%)",
      cardBg: "hsl(228 10% 92%)",
      text: "",
      muted: "",
      tag: "",
      dotInactive: "hsl(228 15% 75%)",
      dotActive: "hsl(186 79% 47%)",
    };
  }, [variant]);

  const isCream = variant === "cream";

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(idx);
        },
        { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [steps.length]);

  const goTo = (i: number) => {
    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className={`${tokens.section} relative`}>
      {!isCream && <div className="dot-grid" />}
      <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-20 md:pt-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: tokens.numberAccent }}
            />
            <span className="section-label">{label}</span>
          </div>
          <h2
            className={`text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-4 ${tokens.title}`}
            style={isCream ? { color: "hsl(228 56% 10%)" } : undefined}
          >
            {heading}
          </h2>
          {intro && (
            <p
              className={`text-base leading-relaxed ${tokens.intro}`}
              style={isCream ? { color: "hsl(228 15% 50%)" } : undefined}
            >
              {intro}
            </p>
          )}
        </div>
      </div>

      {/* Indicateur latéral (desktop) */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-3 pointer-events-none">
        {steps.map((_, i) => {
          const active = i === activeIdx;
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Aller à l'étape ${i + 1}`}
              className="pointer-events-auto block rounded-full transition-all duration-500"
              style={{
                width: active ? 10 : 6,
                height: active ? 10 : 6,
                background: active ? tokens.dotActive : tokens.dotInactive,
                opacity: active ? 1 : 0.6,
              }}
            />
          );
        })}
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {steps.map((step, idx) => (
          <ScrollyStepBlock
            key={step.tag + idx}
            ref={(el) => (stepRefs.current[idx] = el)}
            index={idx}
            step={step}
            tokens={tokens}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────────────────────── */

type StepProps = {
  index: number;
  step: ScrollyStep;
  tokens: ReturnType<() => any>;
  variant: "cream" | "navy";
};

const ScrollyStepBlock = forwardRef<HTMLDivElement, StepProps>(
  ({ index, step, tokens, variant }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    const [revealed, setRevealed] = useState(false);
    const Icon = step.icon;

    useEffect(() => {
      const el = localRef.current;
      if (!el) return;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        setRevealed(true);
        return;
      }
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.unobserve(el);
          }
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    const isCream = variant === "cream";
    const numberColor = isCream ? "hsl(228 10% 82%)" : "rgba(255,255,255,0.08)";

    return (
      <div
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className="min-h-[90vh] lg:min-h-screen flex items-center py-16 lg:py-0"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-[auto_1fr_1.1fr] gap-8 lg:gap-12 items-center">
          {/* Numéro */}
          <div
            className="font-grotesk font-bold leading-none tracking-tight select-none transition-all duration-700 flex items-baseline"
            style={{
              color: numberColor,
              fontSize: "clamp(64px, 9vw, 140px)",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateX(0)" : "translateX(-24px)",
            }}
          >
            <span style={{ color: tokens.numberAccent }}>/</span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>

          {/* Image */}
          <div
            className="mx-auto w-full max-w-[420px] transition-all duration-700"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "scale(1)" : "scale(0.92)",
              transitionDelay: "120ms",
            }}
          >
            <div
              className="relative aspect-square overflow-hidden rounded-2xl"
              style={{
                border: tokens.cardBorder,
                background: tokens.cardBg,
                boxShadow: isCream
                  ? "0 30px 60px -30px hsl(228 56% 10% / 0.25)"
                  : "0 30px 60px -30px hsl(186 79% 47% / 0.25)",
              }}
            >
              <img
                src={step.image}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute top-3 left-3 w-7 h-7 border-l-2 border-t-2 border-primary opacity-70" />
              <div className="absolute bottom-3 right-3 w-7 h-7 border-r-2 border-b-2 border-primary opacity-70" />
            </div>
          </div>

          {/* Texte */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "240ms",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {Icon && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(186 79% 47% / 0.12)" }}
                >
                  <Icon size={20} className="text-primary" />
                </div>
              )}
              <span
                className={`font-mono text-[10px] uppercase tracking-[1.2px] ${tokens.tag}`}
                style={isCream ? { color: "hsl(186 60% 32%)" } : undefined}
              >
                {step.tag}
              </span>
            </div>
            <h3
              className={`text-3xl md:text-4xl lg:text-5xl font-grotesk font-semibold mb-4 ${tokens.text}`}
              style={isCream ? { color: "hsl(228 56% 10%)" } : undefined}
            >
              {step.title}
            </h3>
            <p
              className={`text-base md:text-lg leading-relaxed ${tokens.muted}`}
              style={isCream ? { color: "hsl(228 15% 50%)" } : undefined}
            >
              {step.desc}
            </p>
          </div>
        </div>
      </div>
    );
  };
  Comp.displayName = "ScrollyStepBlock";
  // forwardRef wrapper
  return require("react").forwardRef(Comp) as unknown as (
    p: StepProps & { ref?: React.Ref<HTMLDivElement> }
  ) => JSX.Element;
})();
