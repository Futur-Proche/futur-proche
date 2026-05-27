import { useEffect, useMemo, useRef, useState, type ElementType } from "react";

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
 * "Pinned scroll" à la Sadewa : la zone se fige à l'écran, et au fur et à
 * mesure qu'on scrolle, le slide actif (image + texte) est remplacé sur
 * place par le suivant. Une fois le dernier slide passé, le scroll reprend
 * normalement.
 */
export const ScrollyFormats = ({
  steps,
  label,
  heading,
  intro,
  variant = "cream",
}: Props) => {
  const isCream = variant === "cream";
  const accent = "hsl(186 79% 47%)";

  const tokens = useMemo(
    () =>
      isCream
        ? {
            section: "section-cream",
            headingColor: "hsl(228 56% 10%)",
            introColor: "hsl(228 15% 50%)",
            number: "hsl(228 10% 82%)",
            tag: "hsl(186 60% 32%)",
            text: "hsl(228 56% 10%)",
            muted: "hsl(228 15% 50%)",
            cardBorder: "1px solid hsl(228 10% 85%)",
            cardBg: "hsl(228 10% 92%)",
            shadow: "0 30px 60px -30px hsl(228 56% 10% / 0.25)",
            dotInactive: "hsl(228 15% 75%)",
          }
        : {
            section: "",
            headingColor: "#ffffff",
            introColor: "rgba(255,255,255,0.65)",
            number: "rgba(255,255,255,0.08)",
            tag: accent,
            text: "#ffffff",
            muted: "rgba(255,255,255,0.65)",
            cardBorder: "1px solid hsl(228 30% 22%)",
            cardBg: "hsl(228 40% 14%)",
            shadow: "0 30px 60px -30px hsl(186 79% 47% / 0.25)",
            dotInactive: "hsl(228 30% 30%)",
          },
    [isCream]
  );

  // Detect desktop + reduced motion → fallback en stack vertical sinon.
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPinned(mqDesktop.matches && !mqReduce.matches);
    update();
    mqDesktop.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqDesktop.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!pinned) return;
    const el = wrapperRef.current;
    if (!el) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setActiveIdx(0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total; // 0..1
      // Mappe [0..1] sur N segments → index entier
      const idx = Math.min(
        steps.length - 1,
        Math.floor(progress * steps.length)
      );
      setActiveIdx(idx);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned, steps.length]);

  const goTo = (i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;
    const startTop = window.scrollY + rect.top;
    // cible le milieu du segment i
    const target = startTop + ((i + 0.5) / steps.length) * total;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section
      className={`${tokens.section} relative`}
      style={
        isCream
          ? undefined
          : { background: "hsl(228 56% 10%)", color: "hsl(40 33% 94%)" }
      }
    >
      {!isCream && <div className="dot-grid" />}

      {pinned ? (
        <>
          {/* Indicateur latéral cliquable */}
          <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
            {steps.map((_, i) => {
              const active = i === activeIdx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Aller à l'étape ${i + 1}`}
                  className="block rounded-full transition-all duration-500"
                  style={{
                    width: active ? 10 : 6,
                    height: active ? 10 : 6,
                    background: active ? accent : tokens.dotInactive,
                    opacity: active ? 1 : 0.7,
                  }}
                />
              );
            })}
          </div>

          {/* Zone pinned : hauteur = N × 100vh */}
          <div
            ref={wrapperRef}
            style={{ height: `${steps.length * 100}vh` }}
            className="relative"
          >
            <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
              {/* En-tête sticky — visible pendant tout le pin */}
              <div className="container mx-auto px-6 lg:px-12 pt-24 md:pt-28 pb-4 md:pb-6 shrink-0">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
                    <span className="section-label">{label}</span>
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-3"
                    style={{ color: tokens.headingColor }}
                  >
                    {heading}
                  </h2>
                  {intro && (
                    <p
                      className="text-sm md:text-base leading-relaxed"
                      style={{ color: tokens.introColor }}
                    >
                      {intro}
                    </p>
                  )}
                </div>
              </div>

              {/* Slide actif */}
              <div className="flex-1 flex items-center">
                <div className="container mx-auto px-6 lg:px-12 w-full">
                  <div className="relative">
                    {steps.map((step, i) => (
                      <Slide
                        key={step.tag + i}
                        step={step}
                        index={i}
                        active={i === activeIdx}
                        tokens={tokens}
                        accent={accent}
                      />
                    ))}
                    {/* Spacer pour donner la hauteur naturelle au conteneur */}
                    <div aria-hidden className="invisible">
                      <SlideContent
                        step={steps[0]}
                        index={0}
                        tokens={tokens}
                        accent={accent}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Mobile / reduced motion : stack vertical simple
        <div className="container mx-auto px-6 lg:px-12 pb-20">
          <div className="flex flex-col gap-20">
            {steps.map((step, i) => (
              <div key={step.tag + i}>
                <SlideContent step={step} index={i} tokens={tokens} accent={accent} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

/* ──────────────────────────────────────────────────────────── */

type Tokens = {
  headingColor: string;
  introColor: string;
  number: string;
  tag: string;
  text: string;
  muted: string;
  cardBorder: string;
  cardBg: string;
  shadow: string;
  dotInactive: string;
};

type SlideProps = {
  step: ScrollyStep;
  index: number;
  active: boolean;
  tokens: Tokens;
  accent: string;
};

const Slide = ({ step, index, active, tokens, accent }: SlideProps) => (
  <div
    className="absolute inset-0 transition-all duration-500 ease-out"
    style={{
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(16px)",
      pointerEvents: active ? "auto" : "none",
    }}
    aria-hidden={!active}
  >
    <SlideContent step={step} index={index} tokens={tokens} accent={accent} />
  </div>
);

const SlideContent = ({
  step,
  index,
  tokens,
  accent,
}: Omit<SlideProps, "active">) => {
  const Icon = step.icon;
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-[auto_1fr_1.1fr] gap-8 lg:gap-12 items-center">
      {/* Numéro */}
      <div
        className="font-grotesk font-bold leading-none tracking-tight select-none flex items-baseline"
        style={{ color: tokens.number, fontSize: "clamp(64px, 9vw, 140px)" }}
      >
        <span style={{ color: accent }}>/</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>

      {/* Image */}
      <div className="mx-auto w-full max-w-[420px]">
        <div
          className="relative aspect-square overflow-hidden rounded-2xl"
          style={{
            border: tokens.cardBorder,
            background: tokens.cardBg,
            boxShadow: tokens.shadow,
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
      <div>
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
            className="font-mono text-[10px] uppercase tracking-[1.2px]"
            style={{ color: tokens.tag }}
          >
            {step.tag}
          </span>
        </div>
        <h3
          className="text-3xl md:text-4xl lg:text-5xl font-grotesk font-semibold mb-4"
          style={{ color: tokens.text }}
        >
          {step.title}
        </h3>
        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ color: tokens.muted }}
        >
          {step.desc}
        </p>
      </div>
    </div>
  );
};
