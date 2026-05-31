import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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

const yesItems = [
  \"Vous avez 7+ ans d'expérience\",
  \"Vous aimez jouer collectif et en équipe\",
  \"Vous préférez les conversations franches aux discours corporate\",
  \"Vous voulez donner autant que recevoir\",
];

const noItems = [
  "Vous cherchez des \"hacks\" ou des raccourcis",
  "Vous voulez vendre vos services à la communauté",
  "Vous débutez dans le métier",
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
    className="group relative text-left w-full overflow-hidden transition-all duration-500 ease-out rounded-xl"
    style={{
      background: "#ffffff",
      border: `1px solid ${open ? "hsl(186 79% 47% / 0.55)" : "hsl(228 10% 85%)"}`,
      boxShadow: open ? "0 20px 50px -25px hsl(228 56% 10% / 0.18)" : "none",
      transitionDelay: `${idx * 120}ms`,
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(20px)",
    }}
  >
    {/* vertical cyan bar */}
    <div
      className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary origin-bottom transition-transform duration-500 ease-out"
      style={{ transform: open ? "scaleY(1)" : "scaleY(0)" }}
    />

    <div className="relative p-6 md:p-7">
      <div className="flex items-start justify-between gap-4 mb-4">
        <span
          className="font-mono text-[10px] uppercase tracking-[1.5px]"
          style={{ color: "hsl(186 60% 32%)" }}
        >
          {p.tag}
        </span>
        <span
          className="font-grotesk text-2xl leading-none transition-transform duration-500"
          style={{
            color: "hsl(186 60% 32%)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
          aria-hidden
        >
          +
        </span>
      </div>

      <div
        className="h-px mb-5 overflow-hidden"
        style={{ background: "hsl(228 10% 88%)" }}
      >
        <div
          className="h-full bg-primary transition-all duration-[900ms] ease-out"
          style={{
            width: open ? "100%" : active ? "40%" : "0%",
            transitionDelay: `${idx * 140 + 400}ms`,
          }}
        />
      </div>

      <h3
        className="text-xl md:text-2xl font-grotesk font-semibold tracking-tight mb-3"
        style={{ color: "hsl(228 56% 10%)" }}
      >
        {p.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "hsl(228 15% 45%)" }}
      >
        {p.desc}
      </p>

      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className="pt-5 mt-5"
            style={{ borderTop: "1px solid hsl(228 10% 88%)" }}
          >
            <span
              className="font-mono text-[10px] uppercase tracking-[1.5px] mb-3 block"
              style={{ color: "hsl(228 15% 55%)" }}
            >
              — Sujets typiques
            </span>
            <ul className="space-y-2">
              {p.details.map((d) => (
                <li
                  key={d}
                  className="text-sm leading-relaxed flex gap-2"
                  style={{ color: "hsl(228 25% 25%)" }}
                >
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

const RevealItem = ({
  children,
  delay,
  variant,
}: {
  children: React.ReactNode;
  delay: number;
  variant: "yes" | "no";
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const Icon = variant === "yes" ? Check : X;
  const iconColor = variant === "yes" ? "text-primary" : "";
  const textColor = variant === "yes" ? "hsl(228 56% 10%)" : "hsl(228 15% 45%)";

  return (
    <li
      ref={ref}
      className="flex items-start gap-3 transition-all duration-700 ease-out"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        filter: shown ? "blur(0px)" : "blur(8px)",
      }}
    >
      <Icon
        size={18}
        className={`mt-0.5 flex-shrink-0 ${iconColor}`}
        style={variant === "no" ? { color: "hsl(228 15% 70%)" } : undefined}
      />
      <span
        className={`text-base ${variant === "yes" ? "font-medium" : ""} leading-snug`}
        style={{ color: textColor }}
      >
        {children}
      </span>
    </li>
  );
};

export const ForYouSection = () => {
  const profilsReveal = useStaggeredReveal<HTMLDivElement>(profils.length, 0, 0.2);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "hsl(186 60% 32%)" }}
          />
          <span className="section-label">Pour qui</span>
        </div>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-grotesk font-bold tracking-tight mb-3"
          style={{ color: "hsl(228 56% 10%)" }}
        >
          Votre place est ici si...
        </h2>
        <p
          className=\"font-serif italic text-xl md:text-2xl max-w-2xl leading-snug mb-12\"
          style={{ color: \"hsl(228 25% 25%)\" }}
        >
          Vous vous reconnaissez dans ces profils
        </p>

        {/* Profils */}
        <div
          ref={profilsReveal.ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-start"
        >
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

        {/* Separator + transition label */}
        <div className="flex items-center gap-4 mt-20 mb-10">
          <span className="section-label whitespace-nowrap">— Et au-delà du profil</span>
          <div className="h-px flex-1" style={{ background: "hsl(228 10% 80%)" }} />
        </div>

        {/* Oui / Non */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div
            className="bg-white rounded-xl p-7 md:p-8"
            style={{ border: "1px solid hsl(228 10% 85%)" }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5 block text-primary">
              — Oui
            </span>
            <ul className="space-y-4">
              {yesItems.map((item, i) => (
                <RevealItem key={item} delay={i * 110} variant="yes">
                  {item}
                </RevealItem>
              ))}
            </ul>
          </div>

          <div
            className="bg-white rounded-xl p-7 md:p-8"
            style={{ border: "1px solid hsl(228 10% 85%)" }}
          >
            <span
              className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5 block"
              style={{ color: "hsl(228 15% 60%)" }}
            >
              — Non
            </span>
            <ul className="space-y-4">
              {noItems.map((item, i) => (
                <RevealItem key={item} delay={i * 110} variant="no">
                  {item}
                </RevealItem>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/candidater"
            className="inline-flex items-center gap-2 bg-navy text-cream px-7 py-3.5 rounded-lg font-grotesk text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Devenir Futuriste →
          </Link>
        </div>
      </div>
    </section>
  );
};
