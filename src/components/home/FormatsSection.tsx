import { forwardRef, useEffect, useRef, useState } from "react";
import communityGroup from "@/assets/community-group.jpg";
import eventTalk from "@/assets/event-talk.jpg";
import networkingEchanges from "@/assets/networking-echanges.jpg";
import ambianceGroupe from "@/assets/ambiance-groupe.jpg";

const formats = [
  {
    tag: "01_WhatsApp",
    title: "Échanges quotidiens",
    desc: "Questions, recos, débats. Réponses en heures, pas en jours.",
    detail: "Un fil vivant où l'on partage les vrais arbitrages : choix d'outil, négociation d'agence, recadrage d'équipe. Pas de posture, pas de pitch — juste des pairs qui répondent vite et bien.",
    image: communityGroup,
  },
  {
    tag: "02_Events",
    title: "After Proche",
    desc: "Speakers triés sur le volet. Networking entre pairs. Paris, Lyon, Bordeaux et plus.",
    detail: "Des rencontres physiques resserrées (40-80 personnes) où l'on parle vraiment. Format speaker + tables rondes + apéro long. Pas de stand, pas de goodies.",
    image: eventTalk,
  },
  {
    tag: "03_Podcast",
    title: "Conversations sans filtre",
    desc: "Avec ceux qui font, pas avec ceux qui théorisent. Des convictions forgées sur le terrain.",
    detail: "Des épisodes longs avec des leaders Marketing / Comm qui acceptent de raconter leurs vraies décisions — celles qui ont marché, celles qui ont raté, et ce qu'ils en retiennent.",
    image: networkingEchanges,
  },
  {
    tag: "04_Jobs",
    title: "Opportunités",
    desc: "Recrutement et missions partagés entre membres. Le bouche-à-oreille de pros seniors.",
    detail: "Postes, freelances, mandats d'advisory — circulés en circuit fermé. Les meilleures opportunités ne passent jamais par LinkedIn ; elles passent ici.",
    image: ambianceGroupe,
  },
];

export const FormatsSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(idx);
        },
        { threshold: 0.6, rootMargin: "-20% 0px -30% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full" style={{ background: "hsl(186 60% 32%)" }} />
            <span className="section-label">Une commu, plusieurs formats</span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-4"
            style={{ color: "hsl(228 56% 10%)" }}
          >
            Ce qui se passe à l'intérieur.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>
            Quatre canaux complémentaires pour des Futuristes connectés au quotidien et aux moments forts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Sticky media (desktop) */}
          <div className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] tracking-[1.5px]" style={{ color: "hsl(186 60% 32%)" }}>
                {String(activeIdx + 1).padStart(2, "0")} / {String(formats.length).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[1.5px]" style={{ color: "hsl(228 15% 50%)" }}>
                {formats[activeIdx].tag}
              </span>
            </div>
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-lg"
              style={{ border: "1px solid hsl(228 10% 85%)", background: "hsl(228 10% 92%)" }}
            >
              {formats.map((f, i) => (
                <img
                  key={f.tag}
                  src={f.image}
                  alt={f.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: i === activeIdx ? 1 : 0,
                    transform: i === activeIdx ? "scale(1)" : "scale(1.04)",
                    transition: "opacity 700ms ease-out, transform 1200ms ease-out",
                  }}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              {formats.map((_, i) => (
                <span
                  key={i}
                  className="block h-[3px] rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIdx ? 32 : 14,
                    background: i === activeIdx ? "hsl(186 79% 47%)" : "hsl(228 15% 75%)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Scrollable text blocks */}
          <div className="flex flex-col gap-16 lg:gap-32 lg:py-[20vh]">
            {formats.map((f, idx) => (
              <RevealBlock
                key={f.tag}
                ref={(el) => (cardRefs.current[idx] = el)}
                format={f}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const RevealBlock = forwardRef<
  HTMLDivElement,
  { format: typeof formats[number] }
>(({ format: f }, ref) => {
  const [revealed, setRevealed] = useState(false);
  const localRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className="transition-all duration-700"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(32px)",
      }}
    >
      {/* Mobile inline image */}
      <div className="lg:hidden mb-6 aspect-[4/3] overflow-hidden rounded-lg" style={{ border: "1px solid hsl(228 10% 85%)" }}>
        <img src={f.image} alt={f.title} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <span className="font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(186 60% 32%)" }}>{f.tag}</span>
      <h3 className="text-2xl md:text-3xl font-grotesk font-semibold mt-3 mb-3" style={{ color: "hsl(228 56% 10%)" }}>{f.title}</h3>
      <p className="text-base font-medium leading-relaxed mb-3" style={{ color: "hsl(228 56% 10%)" }}>{f.desc}</p>
      <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>{f.detail}</p>
    </div>
  );
});
RevealBlock.displayName = "RevealBlock";
