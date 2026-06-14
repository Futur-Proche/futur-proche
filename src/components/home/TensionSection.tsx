import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type Thought = {
  text: string;
  signature: string;
  x: number; // % within stage
  y: number;
  rotate: number;
  size: "sm" | "md" | "lg";
};

// 10 pensées resserrées, signées (style citation)
const thoughts: Thought[] = [
  { text: "Je suis seul·e à me battre avec mon CEO. Pas assez de soutien de la tech et du produit.", signature: "CMO, SaaS B2B", x: 18, y: 38, rotate: -2, size: "lg" },
  { text: "CAC ou LTV — quelle north star je suis censé·e suivre ce trimestre ?", signature: "Head of Growth", x: 72, y: 34, rotate: 2, size: "md" },
  { text: "Encore un board deck à défendre sans benchmark sectoriel solide.", signature: "VP Marketing", x: 45, y: 50, rotate: -1, size: "md" },
  { text: "On me demande de couper 20% du budget paid. Sur quoi ?", signature: "Directrice Marketing", x: 80, y: 58, rotate: 2, size: "sm" },
  { text: "Cette agence me ressort les mêmes slides que la précédente.", signature: "CMO, DTC", x: 14, y: 60, rotate: 2, size: "md" },
  { text: "Faut-il vraiment changer de CRM maintenant ? Et pour lequel ?", signature: "Head of Marketing", x: 56, y: 70, rotate: -2, size: "sm" },
  { text: "Mon équipe attend une vision. Je n'ai que des hypothèses.", signature: "VP Comm", x: 76, y: 76, rotate: -2, size: "md" },
  { text: "Le ComEx veut du ROI. Le brand met 18 mois à payer.", signature: "Brand Director", x: 36, y: 80, rotate: 2, size: "sm" },
  { text: "Je n'ai personne à qui demander « tu ferais quoi à ma place ? »", signature: "CMO, fintech", x: 18, y: 82, rotate: -1, size: "md" },
  { text: "L'IA générative : je dois trancher cette semaine, sans recul.", signature: "Head of Content", x: 60, y: 42, rotate: -1, size: "sm" },
  { text: "Mon CFO veut un ROI à 90 jours sur une campagne brand.", signature: "CMO, retail", x: 28, y: 30, rotate: 1, size: "sm" },
  { text: "MMM, MTA, incrementality — je tranche comment ?", signature: "Head of Analytics", x: 88, y: 46, rotate: -2, size: "sm" },
  { text: "Recruter un·e Head of Growth senior : 6 mois que je cherche.", signature: "VP Marketing", x: 8, y: 48, rotate: 1, size: "md" },
  { text: "Le board me demande une stratégie IA. Personne en interne n'en a fait.", signature: "CMO, industrie", x: 50, y: 26, rotate: 2, size: "md" },
  { text: "Mon équipe brûle. Je n'ose plus leur ajouter un projet.", signature: "Directrice Comm", x: 90, y: 30, rotate: -1, size: "sm" },
  { text: "Internaliser le SEO ou rester avec l'agence ?", signature: "Head of Acquisition", x: 30, y: 64, rotate: -2, size: "sm" },
  { text: "Mon NPS monte, mes ventes baissent. Qu'est-ce que je rate ?", signature: "CMO, DTC", x: 66, y: 60, rotate: 1, size: "md" },
  { text: "Le DG veut « faire comme Backmarket ». On n'a ni le budget ni la marque.", signature: "VP Brand", x: 48, y: 88, rotate: -1, size: "md" },
  { text: "Comment je justifie un budget influence sans data propre ?", signature: "Head of Social", x: 10, y: 72, rotate: 2, size: "sm" },
  { text: "On a 4 outils d'analytics. Aucun ne dit la même chose.", signature: "Directeur Data Marketing", x: 88, y: 88, rotate: -2, size: "sm" },
];

const sizeClasses: Record<Thought["size"], string> = {
  sm: "max-w-[230px] text-[13px] px-4 py-3",
  md: "max-w-[290px] text-[14px] px-5 py-3.5",
  lg: "max-w-[340px] text-[15px] px-5 py-4",
};

export const TensionSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Mobile carousel
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setReduceMotion(true);
      setVisibleCount(thoughts.length);
      return;
    }
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const eased = Math.min(progress / 0.9, 1);
      setVisibleCount(Math.round(eased * thoughts.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mobile auto-rotate quotes
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((p) => (p + 1) % thoughts.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={sectionRef} id="tension" className="relative bg-cream text-navy md:min-h-[200vh]">
      {/* DESKTOP : sticky cloud */}
      <div className="hidden md:block md:sticky md:top-0 md:h-screen overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(hsl(228 56% 10%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* HEADER — cream backdrop so quotes never overlap text */}
        <div
          className="absolute top-0 left-0 right-0 z-30 pt-12 lg:pt-16 pb-4 text-center px-6 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, hsl(36 29% 93%) 65%, hsl(36 29% 93% / 0) 100%)",
          }}
        >
          <span className="section-label mb-2 inline-block">— Le constat</span>
          <h2 className="font-grotesk text-3xl lg:text-5xl font-medium tracking-tight leading-[1.05] mt-2 max-w-3xl mx-auto">
            Ce qui tourne en boucle dans la tête{" "}
            <em className="font-serif italic font-normal">d'un·e leader Marketing / Comm.</em>
          </h2>
        </div>

        {/* CLOUD stage — pushed below header */}
        <div className="absolute inset-0 pt-[180px] lg:pt-[210px] pb-24">
          <div className="relative w-full h-full max-w-6xl mx-auto px-6">
            {thoughts.map((t, i) => {
              const visible = i < visibleCount;
              const floatDelay = (i % 7) * 0.6;
              const floatDur = 6 + (i % 4);
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: `translate(-50%, -50%) rotate(${t.rotate}deg)`,
                    opacity: visible ? 1 : 0,
                    transition: "opacity 700ms cubic-bezier(0.2,0.7,0.2,1), filter 700ms ease",
                    filter: visible ? "blur(0)" : "blur(8px)",
                    zIndex: visible ? 10 : 1,
                  }}
                >
                  <div
                    className={`relative bg-white rounded-2xl shadow-[0_8px_28px_-12px_hsl(228_56%_10%/0.18)] border border-navy/10 font-grotesk leading-snug text-navy ${sizeClasses[t.size]}`}
                    style={{
                      animation: reduceMotion ? undefined : `thoughtFloat ${floatDur}s ease-in-out ${floatDelay}s infinite`,
                    }}
                  >
                    <span className="font-serif italic text-primary text-2xl leading-none mr-1 align-top">«</span>
                    {t.text}
                    <span className="font-serif italic text-primary text-2xl leading-none ml-1 align-bottom">»</span>
                    <div className="mt-2 font-mono text-[9px] uppercase tracking-[1.5px] text-navy/40">— {t.signature}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom backdrop — protects CTA from quote overlap */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[26%] z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, hsl(36 29% 93%) 55%, hsl(36 29% 93% / 0) 100%)",
          }}
        />

        {/* Counter + conclusion */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-30 pointer-events-none px-6">
          <div className="font-mono text-[10px] uppercase tracking-[2px] text-navy/50 mb-3">
            {String(Math.min(visibleCount, thoughts.length)).padStart(2, "0")} / {thoughts.length} pensées
          </div>
          <div className="transition-opacity duration-700" style={{ opacity: visibleCount >= thoughts.length ? 1 : 0 }}>
            <p className="font-grotesk text-lg lg:text-xl text-navy/80 mb-3">
              Et si vous n'étiez plus <em className="font-serif italic">seul·e à y penser</em> ?
            </p>
            <Link
              to="/candidater"
              className="pointer-events-auto inline-flex items-center gap-2 bg-navy text-cream px-6 py-3 rounded-full font-grotesk text-sm font-medium hover:bg-navy/90 transition-colors"
            >
              Devenir Futuriste →
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE : carrousel de citations */}
      <div className="md:hidden container mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <span className="section-label mb-4 inline-block">— Le constat</span>
          <h2 className="font-grotesk text-2xl font-medium tracking-tight leading-tight mt-3">
            Ce qui tourne en boucle dans la tête{" "}
            <em className="font-serif italic font-normal">d'un·e leader Marketing / Comm.</em>
          </h2>
        </div>

        <div className="relative max-w-md mx-auto">
          <div
            className="relative bg-white rounded-2xl border border-navy/10 shadow-[0_8px_28px_-12px_hsl(228_56%_10%/0.18)] px-6 py-8 min-h-[220px] flex flex-col items-center justify-center text-center"
            key={quoteIdx}
            style={{ animation: "fadeInUp 500ms ease-out both" }}
          >
            <span className="font-serif italic text-primary text-5xl leading-none mb-2">«</span>
            <p className="font-grotesk text-navy text-base leading-snug px-2">{thoughts[quoteIdx].text}</p>
            <span className="font-serif italic text-primary text-5xl leading-none mt-2">»</span>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[1.5px] text-navy/50">— {thoughts[quoteIdx].signature}</p>
          </div>

          <div className="flex justify-center gap-1.5 mt-5">
            {thoughts.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIdx(i)}
                aria-label={`Pensée ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === quoteIdx ? "w-5 bg-navy" : "w-1.5 bg-navy/25"}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="font-grotesk text-base text-navy/80 mb-4">
            Et si vous n'étiez plus <em className="font-serif italic">seul·e à y penser</em> ?
          </p>
          <Link to="/candidater" className="inline-flex items-center gap-2 bg-navy text-cream px-6 py-3 rounded-full font-grotesk text-sm font-medium">
            Devenir Futuriste →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes thoughtFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -6px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default TensionSection;
