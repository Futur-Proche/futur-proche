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

const profils = [
  {
    tag: "01",
    title: "Direction Marketing",
    desc: "CMO, VP Marketing, Head of Growth — qui pilotent budgets et équipes.",
    details: [
      "Pilotage de budgets 7 chiffres et arbitrages d'allocation",
      "Recrutement et structuration d'équipes seniors",
      "Choix d'outils, d'agences, de partenaires stratégiques",
      "Reporting et défense du marketing au COMEX",
    ],
  },
  {
    tag: "02",
    title: "Direction Communication",
    desc: "Dircom, Head of Brand, Comm Corporate — au croisement image et stratégie.",
    details: [
      "Positionnement de marque et narratif corporate",
      "Gestion de crise et communication sensible",
      "Influence, RP et relations institutionnelles",
      "Alignement entre marque employeur et marque produit",
    ],
  },
  {
    tag: "03",
    title: "Founders & C-Level",
    desc: "Fondateurs et dirigeants qui portent eux-mêmes la marque.",
    details: [
      "Construction d'une voix de marque incarnée par le dirigeant",
      "Choix de premier CMO et structuration de la fonction",
      "Arbitrages entre acquisition, marque et produit",
      "Préparation de levée, M&A ou repositionnement",
    ],
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
          transition: "transform 700ms cubic-bezier(0.7,0,0.2,1), opacity 700ms ease-out",
          transform: `${active ? "translateY(0)" : "translateY(30px)"} rotateY(${flipped ? 180 : 0}deg)`,
          opacity: active ? 1 : 0,
          transitionDelay: `${index * 120}ms`,
          minHeight: "320px",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 p-8 md:p-12"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-white/40">
              {stat.label}
            </span>
            <span className="font-mono text-[10px] text-white/30">0{index + 1}</span>
          </div>

          <div ref={ref as React.RefObject<HTMLDivElement>} className="flex items-end gap-1 mb-6">
            <span className="text-6xl md:text-8xl font-grotesk font-bold text-white leading-[0.85] tabular-nums">
              {animated}
            </span>
            <span className="text-3xl md:text-5xl font-grotesk font-bold text-primary leading-none pb-1">
              {stat.suffix}
            </span>
          </div>

          <div className="h-px w-full bg-white/10 mb-3 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-[1600ms] ease-out"
              style={{ width: active ? `${stat.fill * 100}%` : "0%", transitionDelay: `${index * 120 + 200}ms` }}
            />
          </div>

          <span className="font-mono text-[11px] tracking-[1px] text-white/60">{stat.sub}</span>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between"
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
          <p className="text-base md:text-lg leading-relaxed text-white/90 font-grotesk">
            {stat.back}
          </p>
          <span className="font-mono text-[10px] text-white/30">0{index + 1}</span>
        </div>
      </div>
    </div>
  );
};

const ProfilCard = ({
  p,
  idx,
  active,
  open,
  onToggle,
}: {
  p: typeof profils[number];
  idx: number;
  active: boolean;
  open: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    className="group relative text-left w-full overflow-hidden transition-all duration-500 ease-out"
    style={{
      background: open ? "hsl(228 50% 12%)" : "hsl(228 56% 10%)",
      border: `1px solid ${open ? "hsl(186 79% 47% / 0.5)" : "hsl(228 30% 22%)"}`,
      transitionDelay: `${idx * 140}ms`,
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(24px)",
    }}
  >
    {/* clip-path mask reveal at mount */}
    <div
      className="absolute inset-0 bg-[hsl(228_56%_10%)] transition-all duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)] z-20 pointer-events-none"
      style={{
        clipPath: active ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transitionDelay: `${idx * 140}ms`,
      }}
    />

    {/* vertical cyan bar */}
    <div
      className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary origin-bottom transition-transform duration-500 ease-out z-10"
      style={{ transform: open ? "scaleY(1)" : "scaleY(0)" }}
    />

    <div className="relative z-10 p-7 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">
          {p.tag}
        </span>
        <span
          className="font-grotesk text-2xl text-primary leading-none transition-transform duration-500"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          +
        </span>
      </div>

      <div className="h-px bg-white/10 mb-5 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-[900ms] ease-out"
          style={{
            width: open ? "100%" : active ? "40%" : "0%",
            transitionDelay: `${idx * 140 + 400}ms`,
          }}
        />
      </div>

      <h3 className="text-xl md:text-2xl font-grotesk font-semibold text-white tracking-tight mb-3">
        {p.title}
      </h3>
      <p className="text-sm text-white/65 leading-relaxed">{p.desc}</p>

      {/* expandable details */}
      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-5 mt-5 border-t border-white/10">
            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-white/40 mb-3 block">
              — Sujets typiques
            </span>
            <ul className="space-y-2">
              {p.details.map((d) => (
                <li key={d} className="text-sm text-white/80 leading-relaxed flex gap-2">
                  <span className="text-primary mt-1.5 shrink-0">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </button>
);

export const KeyElementsSection = () => {
  const statsReveal = useStaggeredReveal<HTMLDivElement>(stats.length, 0, 0.25);
  const profilsReveal = useStaggeredReveal<HTMLDivElement>(profils.length, 0, 0.25);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

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
          <span className="block mt-1 text-white/30 text-sm font-mono">Survolez chaque carte pour en savoir plus.</span>
        </p>

        <div
          ref={statsReveal.ref}
          className="grid grid-cols-1 md:grid-cols-2 border-t border-l"
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

        <div className="mt-24 md:mt-32">
          <div className="h-px w-full bg-white/10 mb-16 md:mb-20" />
        </div>

        <div ref={profilsReveal.ref}>
          <span className="font-mono text-xs uppercase tracking-[1.8px] text-primary mb-3 block">
            — Trois profils, une même exigence
          </span>
          <p
            className="font-serif italic text-xl md:text-2xl text-white/80 mb-4 max-w-2xl leading-snug"
          >
            À qui s'adresse vraiment Futur Proche.
          </p>
          <p className="text-white/40 text-sm font-mono mb-12">Cliquez sur un profil pour le découvrir.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            {profils.map((p, i) => (
              <ProfilCard
                key={p.tag}
                p={p}
                idx={i}
                active={profilsReveal.revealed[i]}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
