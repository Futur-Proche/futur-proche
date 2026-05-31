import { useState } from "react";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";

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
    className="group relative text-left w-full overflow-hidden transition-all duration-500 ease-out rounded-sm"
    style={{
      background: open ? "hsl(228 50% 12%)" : "hsl(228 56% 10%)",
      border: `1px solid ${open ? "hsl(186 79% 47% / 0.5)" : "hsl(228 30% 22%)"}`,
      transitionDelay: `${idx * 140}ms`,
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(24px)",
    }}
  >
    <div
      className="absolute inset-0 bg-[hsl(228_56%_10%)] transition-all duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)] z-20 pointer-events-none"
      style={{
        clipPath: active ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transitionDelay: `${idx * 140}ms`,
      }}
    />

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

export const ProfilesSection = () => {
  const profilsReveal = useStaggeredReveal<HTMLDivElement>(profils.length, 0, 0.25);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="section-navy relative">
      {/* subtle separator from the previous navy section */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(186 79% 47% / 0.5) 50%, transparent 100%)",
        }}
      />
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div ref={profilsReveal.ref}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">— Trois profils, une même exigence</span>
          </div>
          <h2 className="font-serif italic text-3xl md:text-4xl text-white/90 mb-4 max-w-2xl leading-snug">
            À qui s'adresse vraiment Futur Proche.
          </h2>
          <p className="text-white/40 text-sm font-mono mb-12">
            Cliquez sur un profil pour le découvrir.
          </p>
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

export default ProfilesSection;
