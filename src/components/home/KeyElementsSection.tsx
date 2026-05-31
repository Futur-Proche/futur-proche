import { useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";

const stats = [
  {
    value: 850,
    suffix: "+",
    label: "FUTURISTES",
    sub: "B2B • B2C • Startups",
    fill: 0.92,
    back: "Une communauté en croissance constante, sélectionnée à l'entrée pour garantir la qualité des échanges.",
  },
  {
    value: 7,
    suffix: "+",
    label: "ANNÉES_XP_MIN",
    sub: "Seniors confirmés",
    fill: 0.55,
    back: "Le seuil pour des conversations entre pairs, pas entre niveaux. On parle vrais sujets, vrais arbitrages.",
  },
  {
    value: 40,
    suffix: "%",
    label: "C_LEVEL",
    sub: "CMO • VP • Head of",
    fill: 0.4,
    back: "Une vraie densité de décideurs autour de la table. Vos pairs prennent les mêmes décisions que vous.",
  },
  {
    value: 15,
    suffix: "+",
    label: "AFTER_PROCHE",
    sub: "Paris • Lyon • Bordeaux",
    fill: 0.75,
    back: "Des After Proche dans toutes les grandes places françaises. Format speaker + tables rondes + apéro long.",
  },
];

const StatCell = ({
  stat,
  active,
  index,
}: {
  stat: typeof stats[number];
  active: boolean;
  index: number;
}) => {
  const { value: animated, ref } = useCountUp(stat.value);
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-full"
      style={{ perspective: "1400px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((v) => !v)}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition:
            "transform 700ms cubic-bezier(0.7,0,0.2,1), opacity 700ms ease-out",
          transform: `${active ? "translateY(0)" : "translateY(30px)"} rotateY(${
            flipped ? 180 : 0
          }deg)`,
          opacity: active ? 1 : 0,
          transitionDelay: `${index * 120}ms`,
          minHeight: "240px",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 p-6 md:p-7 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-white/40">
              {stat.label}
            </span>
            <span className="font-mono text-[10px] text-white/30">
              0{index + 1}
            </span>
          </div>

          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="flex items-end gap-1 mb-5"
          >
            <span className="text-4xl md:text-5xl font-grotesk font-bold text-white leading-[0.85] tabular-nums">
              {animated}
            </span>
            <span className="text-2xl md:text-3xl font-grotesk font-bold text-primary leading-none pb-1">
              {stat.suffix}
            </span>
          </div>

          <div>
            <div className="h-px w-full bg-white/10 mb-3 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-[1600ms] ease-out"
                style={{
                  width: active ? `${stat.fill * 100}%` : "0%",
                  transitionDelay: `${index * 120 + 200}ms`,
                }}
              />
            </div>
            <span className="font-mono text-[11px] tracking-[1px] text-white/60">
              {stat.sub}
            </span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 p-6 md:p-7 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "hsl(228 50% 12%)",
            borderLeft: "3px solid hsl(186 79% 47%)",
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">
            — {stat.label}
          </span>
          <p className="text-sm md:text-base leading-relaxed text-white/90 font-grotesk">
            {stat.back}
          </p>
          <span className="font-mono text-[10px] text-white/30">
            0{index + 1}
          </span>
        </div>
      </div>
    </div>
  );
};

export const KeyElementsSection = () => {
  const statsReveal = useStaggeredReveal<HTMLDivElement>(stats.length, 0, 0.25);

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
          <span className="block mt-1 text-white/30 text-sm font-mono">
            Survolez chaque carte pour en savoir plus.
          </span>
        </p>

        <div
          ref={statsReveal.ref}
          className="grid grid-cols-2 md:grid-cols-4 border-t border-l"
          style={{ borderColor: "hsl(0 0% 100% / 0.1)" }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="border-r border-b"
              style={{ borderColor: "hsl(0 0% 100% / 0.1)" }}
            >
              <StatCell stat={s} active={statsReveal.revealed[i]} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
