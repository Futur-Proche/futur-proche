import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type Thought = {
  text: string;
  /** approx position in % within the stage (desktop) */
  x: number;
  y: number;
  rotate: number;
  size: "sm" | "md" | "lg";
  /** which side the speech tail points */
  tail: "bl" | "br" | "tl" | "tr";
};

// 15 pensées de CMO — ordre = ordre d'apparition au scroll
const thoughts: Thought[] = [
  { text: "Je suis seul·e à me battre avec mon CEO. Pas assez de soutien de la tech et du produit.", x: 12, y: 18, rotate: -3, size: "lg", tail: "bl" },
  { text: "CAC ou LTV — quelle north star je suis censé·e suivre ce trimestre ?", x: 68, y: 12, rotate: 2, size: "md", tail: "br" },
  { text: "Encore un board deck à défendre sans benchmark sectoriel solide.", x: 40, y: 28, rotate: -1, size: "md", tail: "bl" },
  { text: "On me demande de couper 20% du budget paid. Sur quoi ?", x: 78, y: 36, rotate: 3, size: "sm", tail: "tl" },
  { text: "Cette agence me ressort les mêmes slides que la précédente.", x: 6, y: 42, rotate: 2, size: "md", tail: "br" },
  { text: "Faut-il vraiment changer de CRM maintenant ? Et pour lequel ?", x: 52, y: 50, rotate: -2, size: "sm", tail: "tr" },
  { text: "Je passe plus de temps à justifier qu'à exécuter.", x: 24, y: 58, rotate: 3, size: "sm", tail: "br" },
  { text: "Mon équipe attend une vision. Je n'ai que des hypothèses.", x: 70, y: 62, rotate: -3, size: "md", tail: "bl" },
  { text: "Ce SDR tool à 80k€/an — est-ce que quelqu'un l'a vraiment testé ?", x: 8, y: 72, rotate: 1, size: "md", tail: "tr" },
  { text: "Le ComEx veut du ROI. Le brand met 18 mois à payer.", x: 44, y: 76, rotate: 2, size: "sm", tail: "bl" },
  { text: "Je n'ai personne à qui demander « tu ferais quoi à ma place ? »", x: 76, y: 80, rotate: -2, size: "md", tail: "tr" },
  { text: "Recruter un Head of Growth — mais où sont les bons en off ?", x: 30, y: 8, rotate: 2, size: "sm", tail: "tl" },
  { text: "L'IA générative : je dois trancher cette semaine, sans recul.", x: 58, y: 38, rotate: -2, size: "sm", tail: "br" },
  { text: "Mon NPS monte, mon CAC aussi. Bonne ou mauvaise nouvelle ?", x: 16, y: 30, rotate: 3, size: "sm", tail: "tr" },
  { text: "Si je quitte, qui dans mon réseau peut me passer le bon poste ?", x: 60, y: 86, rotate: -1, size: "md", tail: "tl" },
];

const sizeClasses: Record<Thought["size"], string> = {
  sm: "max-w-[220px] text-[13px] px-4 py-3",
  md: "max-w-[280px] text-[14px] px-5 py-3.5",
  lg: "max-w-[340px] text-[15px] px-5 py-4",
};

// Small dots below the bubble = "thought" tail (two circles)
const tailPositions: Record<Thought["tail"], { side: "left" | "right"; vertical: "bottom" | "top" }> = {
  bl: { side: "left", vertical: "bottom" },
  br: { side: "right", vertical: "bottom" },
  tl: { side: "left", vertical: "top" },
  tr: { side: "right", vertical: "top" },
};

export const TensionSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

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
      // Reveal bubbles over the first 90% of the scroll, last 10% = settled cloud
      const eased = Math.min(progress / 0.9, 1);
      const count = Math.round(eased * thoughts.length);
      setVisibleCount(count);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tension"
      className="relative bg-cream text-navy md:min-h-[320vh]"
    >
      {/* DESKTOP : sticky cloud stage */}
      <div className="hidden md:block md:sticky md:top-0 md:h-screen overflow-hidden">
        {/* subtle dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(hsl(228 56% 10%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* header */}
        <div className="absolute top-0 left-0 right-0 pt-16 lg:pt-20 text-center px-6 z-20 pointer-events-none">
          <span className="section-label mb-3 inline-block">— Le constat</span>
          <h2 className="font-grotesk text-3xl lg:text-5xl font-medium tracking-tight leading-[1.05] mt-2 max-w-3xl mx-auto">
            Ce qui tourne en boucle dans la tête{" "}
            <em className="font-serif italic font-normal">d'un·e leader Marketing / Comm.</em>
          </h2>
        </div>

        {/* cloud stage */}
        <div className="absolute inset-0 pt-40 pb-32">
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
                    transition:
                      "opacity 700ms cubic-bezier(0.2,0.7,0.2,1), filter 700ms ease",
                    filter: visible ? "blur(0)" : "blur(8px)",
                    zIndex: visible ? 10 : 1,
                  }}
                >
                  <div
                    className={`relative bg-white rounded-2xl shadow-[0_8px_28px_-12px_hsl(228_56%_10%/0.18)] border border-navy/10 font-grotesk leading-snug text-navy ${sizeClasses[t.size]}`}
                    style={{
                      animation: reduceMotion
                        ? undefined
                        : `thoughtFloat ${floatDur}s ease-in-out ${floatDelay}s infinite`,
                    }}
                  >
                    {t.text}
                    {/* thought-bubble tail: 2 small circles */}
                    {(() => {
                      const tp = tailPositions[t.tail];
                      const sideStyle = tp.side === "left" ? { left: "16px" } : { right: "16px" };
                      const vBig = tp.vertical === "bottom" ? { bottom: "-10px" } : { top: "-10px" };
                      const vSmall = tp.vertical === "bottom" ? { bottom: "-22px" } : { top: "-22px" };
                      return (
                        <>
                          <span
                            className="absolute w-3 h-3 rounded-full bg-white border border-navy/10"
                            style={{ ...sideStyle, ...vBig }}
                          />
                          <span
                            className="absolute w-1.5 h-1.5 rounded-full bg-white border border-navy/10"
                            style={{ ...sideStyle, ...vSmall, marginLeft: tp.side === "left" ? "-6px" : 0, marginRight: tp.side === "right" ? "-6px" : 0 }}
                          />
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* counter + conclusion */}
        <div className="absolute bottom-6 left-0 right-0 text-center z-20 pointer-events-none px-6">
          <div className="font-mono text-[10px] uppercase tracking-[2px] text-navy/50 mb-3">
            {String(Math.min(visibleCount, thoughts.length)).padStart(2, "0")} / {thoughts.length} pensées
          </div>
          <div
            className="transition-opacity duration-700"
            style={{ opacity: visibleCount >= thoughts.length ? 1 : 0 }}
          >
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

      {/* MOBILE : fil de pensées en quinconce */}
      <div className="md:hidden container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-block">— Le constat</span>
          <h2 className="font-grotesk text-3xl font-medium tracking-tight leading-tight mt-3">
            Ce qui tourne en boucle dans la tête{" "}
            <em className="font-serif italic font-normal">d'un·e leader Marketing / Comm.</em>
          </h2>
        </div>
        <div className="space-y-5">
          {thoughts.map((t, i) => {
            const align = i % 2 === 0 ? "self-start" : "self-end";
            return (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div
                  className={`relative bg-white rounded-2xl border border-navy/10 shadow-[0_6px_20px_-10px_hsl(228_56%_10%/0.15)] font-grotesk leading-snug text-navy px-4 py-3 text-[14px] max-w-[85%] ${align}`}
                  style={{
                    animation: `fadeInUp 500ms ease-out ${i * 60}ms both`,
                    transform: `rotate(${t.rotate * 0.4}deg)`,
                  }}
                >
                  {t.text}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <p className="font-grotesk text-base text-navy/80 mb-4">
            Et si vous n'étiez plus <em className="font-serif italic">seul·e à y penser</em> ?
          </p>
          <Link
            to="/candidater"
            className="inline-flex items-center gap-2 bg-navy text-cream px-6 py-3 rounded-full font-grotesk text-sm font-medium hover:bg-navy/90 transition-colors"
          >
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
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default TensionSection;
