import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { value: 850, suffix: "+", label: "FUTURISTES", sub: "B2B • B2C • Startups" },
  { value: 7, suffix: "+", label: "ANNÉES_XP_MIN", sub: "Seniors confirmés" },
  { value: 40, suffix: "%", label: "C_LEVEL", sub: "CMO • VP • Head of" },
  { value: 15, suffix: "+", label: "AFTER_PROCHE", sub: "Paris • Lyon • Bordeaux" },
];

const profils = [
  {
    tag: "01",
    title: "Direction Marketing",
    desc: "CMO, VP Marketing, Head of Growth — qui pilotent budgets et équipes.",
  },
  {
    tag: "02",
    title: "Direction Communication",
    desc: "Dircom, Head of Brand, Comm Corporate — au croisement image et stratégie.",
  },
  {
    tag: "03",
    title: "Founders & C-Level",
    desc: "Fondateurs et dirigeants qui portent eux-mêmes la marque.",
  },
];

const StatItem = ({ value, suffix, label, sub }: { value: number; suffix: string; label: string; sub: string }) => {
  const { value: animated, ref } = useCountUp(value);
  return (
    <div className="relative flex flex-col gap-2 pl-5">
      {/* vertical line that draws in */}
      <span className="absolute left-0 top-0 bottom-0 w-px bg-white/10 overflow-hidden">
        <span className="absolute inset-x-0 top-0 bg-primary animate-[drawLine_1.4s_ease-out_forwards]" />
      </span>
      <span ref={ref} className="text-5xl md:text-6xl font-grotesk font-bold text-white leading-none">
        {animated}
        <span className="text-3xl text-white md:text-4xl align-top">{suffix}</span>
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-white/40">{label}</span>
      <span className="font-mono text-[10px] tracking-[1px] text-primary/80">{sub}</span>
    </div>
  );
};

const ProfilCol = ({ p, idx, active }: { p: typeof profils[number]; idx: number; active: boolean }) => (
  <div
    className="border-t border-white/15 pt-6 transition-all ease-out"
    style={{
      transitionDuration: "800ms",
      transitionDelay: `${idx * 150}ms`,
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(24px)",
    }}
  >
    <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">{p.tag}</span>
    <h3 className="text-xl font-grotesk font-semibold text-white mt-3 mb-2">{p.title}</h3>
    <p className="text-sm text-white/55 leading-relaxed">{p.desc}</p>
  </div>
);

export const KeyElementsSection = () => {
  const profilsRef = useRef<HTMLDivElement>(null);
  const [profilsActive, setProfilsActive] = useState(false);

  useEffect(() => {
    const el = profilsRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setProfilsActive(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setProfilsActive(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section-navy relative">
      <div className="dot-grid" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="section-label">Les chiffres qui comptent</span>
        </div>

        <p className="text-white/50 text-base max-w-2xl mb-12 leading-relaxed">
          B2B, B2C, startups, grands groupes, indépendants — tous secteurs réunis autour d'un même niveau d'exigence.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>

        {/* Profils types — 3 cols animées en cascade */}
        <div ref={profilsRef} className="mt-20 md:mt-24">
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-white/40 mb-8 block">
            — Trois profils, une même exigence
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {profils.map((p, i) => (
              <ProfilCol key={p.tag} p={p} idx={i} active={profilsActive} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drawLine {
          from { height: 0%; }
          to { height: 100%; }
        }
      `}</style>
    </section>
  );
};
