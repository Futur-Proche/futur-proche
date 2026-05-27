import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const painPoints = [
  {
    num: "01",
    title: "Un budget à défendre seul.",
    text: "Personne autour de vous pour challenger vos arbitrages. Le ComEx attend des résultats, pas des explications.",
  },
  {
    num: "02",
    title: "Des décisions qui n'attendent pas.",
    text: "Changer de CRM, lancer un canal, couper un budget — pas le temps d'un appel d'offres ou d'un cabinet.",
  },
  {
    num: "03",
    title: "L'isolement du leader Marketing.",
    text: "Un doute sur un outil, un prestataire, une stratégie. Aucune réponse de quelqu'un qui a vécu la même chose.",
  },
  {
    num: "04",
    title: "Des prestataires qui se ressemblent tous.",
    text: "Mêmes slides, mêmes promesses. Difficile de séparer le bruit du signal sans retour direct de pairs.",
  },
  {
    num: "05",
    title: "Des KPIs qu'on ne peut pas comparer.",
    text: "Vos benchmarks viennent de rapports génériques. Aucune base sectorielle réelle pour vous situer honnêtement.",
  },
  {
    num: "06",
    title: "Une carrière qu'on construit en silence.",
    text: "Les bonnes opportunités circulent en off. Sans réseau de pairs au même niveau, vous passez à côté.",
  },
];

// Position de chaque carte autour du centre (desktop). Ordre = ordre de révélation au scroll.
// grid 12 col × 6 row, le centre occupe col 5-8 / row 3-4.
const desktopSlots = [
  { col: "1 / span 4", row: "1 / span 2", align: "items-start text-left" },     // 01 haut gauche
  { col: "9 / span 4", row: "1 / span 2", align: "items-end text-right" },      // 02 haut droite
  { col: "1 / span 4", row: "3 / span 2", align: "items-start text-left" },     // 03 milieu gauche
  { col: "9 / span 4", row: "3 / span 2", align: "items-end text-right" },      // 04 milieu droite
  { col: "1 / span 4", row: "5 / span 2", align: "items-start text-left" },     // 05 bas gauche
  { col: "9 / span 4", row: "5 / span 2", align: "items-end text-right" },      // 06 bas droite
];

export const TensionSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(painPoints.length);
      return;
    }

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      if (window.innerWidth < 768) {
        setRevealed(painPoints.length);
        return;
      }
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      // on révèle sur 85% de la course, le dernier 15% laisse respirer avant de sortir
      const eased = Math.min(progress / 0.85, 1);
      const n = Math.round(eased * painPoints.length);
      setRevealed(n);
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
      className="relative bg-cream text-navy md:min-h-[200vh]"
    >
      {/* Sticky scene desktop */}
      <div className="md:sticky md:top-0 md:h-screen flex items-center">
        <div className="container mx-auto px-6 py-20 md:py-0 w-full">
          {/* DESKTOP : couronne radiale */}
          <div className="hidden md:grid grid-cols-12 grid-rows-6 gap-6 h-[78vh] relative">
            {/* Centre */}
            <div className="col-start-5 col-span-4 row-start-3 row-span-2 flex flex-col items-center justify-center text-center">
              <span className="section-label mb-4">Le constat</span>
              <h2 className="font-grotesk text-3xl lg:text-5xl font-medium tracking-tight leading-[1.05]">
                Vous connaissez
                <br />
                <em className="font-serif italic font-normal">sûrement ça.</em>
              </h2>
              <div className="mt-6 h-px w-16 bg-navy/20" />
              <p className="mt-4 text-sm text-navy/60 max-w-xs">
                Six tensions que vivent chaque semaine les leaders Marketing / Comm.
              </p>
            </div>

            {/* Cartes autour */}
            {painPoints.map((p, i) => {
              const slot = desktopSlots[i];
              const isOn = i < revealed;
              return (
                <article
                  key={p.num}
                  style={{
                    gridColumn: slot.col,
                    gridRow: slot.row,
                    opacity: isOn ? 1 : 0,
                    transform: isOn ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 600ms ease-out, transform 600ms ease-out",
                  }}
                  className={`flex flex-col justify-center ${slot.align}`}
                >
                  <div className="max-w-[320px]">
                    <span className="font-mono text-xs text-navy/50 tracking-widest">
                      {p.num}
                    </span>
                    <h3 className="mt-2 font-grotesk text-lg font-semibold leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-navy/70 leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* MOBILE : centre puis liste */}
          <div className="md:hidden">
            <div className="text-center mb-12">
              <span className="section-label mb-4 inline-block">Le constat</span>
              <h2 className="font-grotesk text-3xl font-medium tracking-tight leading-tight mt-3">
                Vous connaissez
                <br />
                <em className="font-serif italic font-normal">sûrement ça.</em>
              </h2>
            </div>
            <div className="space-y-6">
              {painPoints.map((p) => (
                <article
                  key={p.num}
                  className="border-t border-navy/15 pt-4 animate-fade-in"
                >
                  <span className="font-mono text-xs text-navy/50 tracking-widest">
                    {p.num}
                  </span>
                  <h3 className="mt-1 font-grotesk text-base font-semibold">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-navy/70 leading-relaxed">
                    {p.text}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/candidater"
                className="inline-flex items-center gap-2 bg-navy text-cream px-6 py-3 rounded-full font-grotesk text-sm font-medium hover:bg-navy/90 transition-colors"
              >
                Devenir Futuriste →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TensionSection;
