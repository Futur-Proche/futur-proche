import { forwardRef, useEffect, useRef, useState } from "react";
import communityGroup from "@/assets/community-group.jpg";
import eventTalk from "@/assets/event-talk.jpg";
import networkingEchanges from "@/assets/networking-echanges.jpg";

const formats = [
  {
    tag: "01_WhatsApp",
    title: "Échanges quotidiens",
    desc: "Questions, recos, débats. Réponses en heures, pas en jours.",
    detail: "Un fil vivant où l'on partage les vrais arbitrages : choix d'outil, négociation d'agence, recadrage d'équipe. Pas de posture, pas de pitch — juste des pairs qui répondent vite et bien.",
  },
  {
    tag: "02_Events",
    title: "After Proche",
    desc: "Speakers triés sur le volet. Networking entre pairs. Paris, Lyon, Bordeaux et plus.",
    detail: "Des rencontres physiques resserrées (40-80 personnes) où l'on parle vraiment. Format speaker + tables rondes + apéro long. Pas de stand, pas de goodies.",
  },
  {
    tag: "03_Podcast",
    title: "Conversations sans filtre",
    desc: "Avec ceux qui font, pas avec ceux qui théorisent. Des convictions forgées sur le terrain.",
    detail: "Des épisodes longs avec des leaders Marketing / Comm qui acceptent de raconter leurs vraies décisions — celles qui ont marché, celles qui ont raté, et ce qu'ils en retiennent.",
  },
  {
    tag: "04_Jobs",
    title: "Opportunités",
    desc: "Recrutement et missions partagés entre membres. Le bouche-à-oreille de pros seniors.",
    detail: "Postes, freelances, mandats d'advisory — circulés en circuit fermé. Les meilleures opportunités ne passent jamais par LinkedIn ; elles passent ici.",
  },
];

const photos = [
  { src: communityGroup, alt: "Communauté futur proche rassemblée", caption: "La communauté réunie lors d'un After Proche" },
  { src: eventTalk, alt: "Conférence After Proche", caption: "Speakers & tables rondes entre pairs" },
  { src: networkingEchanges, alt: "Networking et échanges informels", caption: "Networking et échanges informels" },
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
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20">
          {/* Sticky left */}
          <div className="lg:sticky lg:top-28 lg:self-start lg:h-fit">
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
            <p className="text-base max-w-md mb-8 leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>
              Quatre canaux complémentaires pour des Futuristes connectés au quotidien et aux moments forts.
            </p>

            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[1.5px]" style={{ color: "hsl(186 60% 32%)" }}>
                {String(activeIdx + 1).padStart(2, "0")} / {String(formats.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1.5">
                {formats.map((_, i) => (
                  <span
                    key={i}
                    className="block h-[3px] rounded-full transition-all duration-500"
                    style={{
                      width: i === activeIdx ? 28 : 12,
                      background: i === activeIdx ? "hsl(186 79% 47%)" : "hsl(228 15% 75%)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable right */}
          <div className="flex flex-col gap-6 lg:gap-10">
            {formats.map((f, idx) => (
              <RevealCard
                key={f.tag}
                ref={(el) => (cardRefs.current[idx] = el)}
                tag={f.tag}
                title={f.title}
                desc={f.desc}
                detail={f.detail}
              />
            ))}
          </div>
        </div>

        {/* Photos band */}
        <div className="mt-20 md:mt-28">
          <p className="font-serif italic text-lg md:text-xl mb-6" style={{ color: "hsl(228 15% 40%)" }}>
            WhatsApp, events, podcast, jobs — en images, ça donne ça&nbsp;↓
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <figure key={photo.alt}>
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[1.2px] text-center" style={{ color: "hsl(228 15% 50%)" }}>
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const RevealCard = forwardRef<
  HTMLDivElement,
  { tag: string; title: string; desc: string; detail: string }
>(({ tag, title, desc, detail }, ref) => {
  const [revealed, setRevealed] = useStateReveal(false);
  const localRef = useRefReveal<HTMLDivElement>(null);

  useEffectReveal(() => {
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
      className="bg-white rounded-xl p-7 md:p-9 transition-all duration-700"
      style={{
        border: "1px solid hsl(228 10% 85%)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(32px)",
        filter: revealed ? "blur(0px)" : "blur(6px)",
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(186 60% 32%)" }}>{tag}</span>
      <h3 className="text-2xl md:text-3xl font-grotesk font-semibold mt-3 mb-3" style={{ color: "hsl(228 56% 10%)" }}>{title}</h3>
      <p className="text-base font-medium leading-relaxed mb-3" style={{ color: "hsl(228 56% 10%)" }}>{desc}</p>
      <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>{detail}</p>
    </div>
  );
});
RevealCard.displayName = "RevealCard";
