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
    text: "Changer de CRM, lancer un canal, couper un budget — pas le temps de lancer un appel d'offres ou de mandater un cabinet.",
  },
  {
    num: "03",
    title: "L'isolement du leader Marketing.",
    text: "Un doute sur un outil, un prestataire, une stratégie. Des dizaines de contenus en ligne, mais aucune réponse de quelqu'un qui a vécu la même chose.",
  },
  {
    num: "04",
    title: "Des prestataires qui se ressemblent tous.",
    text: "Mêmes slides, mêmes promesses. Difficile de séparer le bruit du signal sans retour direct de pairs qui les ont testés.",
  },
  {
    num: "05",
    title: "Des KPIs qu'on ne peut pas comparer.",
    text: "Vos benchmarks viennent de rapports génériques. Aucune base sectorielle réelle pour situer votre performance honnêtement.",
  },
  {
    num: "06",
    title: "Une carrière qu'on construit en silence.",
    text: "Les bonnes opportunités circulent en off. Sans réseau de pairs au même niveau, vous passez à côté des mouvements clés.",
  },
];

export const TensionSection = () => {
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
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="section-cream relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "hsl(186 79% 47%)" }}
      />
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20">
          {/* Sticky left */}
          <div className="lg:sticky lg:top-28 lg:self-start lg:h-fit">
            <span className="section-label">— Le constat</span>
            <h2
              className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight"
              style={{ color: "hsl(228 56% 10%)" }}
            >
              Vous connaissez sûrement ça.
            </h2>
            <div className="w-16 h-[3px] bg-primary mb-6 rounded-full" />
            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "hsl(228 15% 40%)" }}>
              Plus le poste est senior, plus les décisions sont solitaires. Et plus l'impact d'une mauvaise décision est visible.
            </p>

            {/* Image placeholder (TODO: replace with real visual) */}
            <div
              className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-lg mb-6"
              style={{
                background:
                  "linear-gradient(135deg, hsl(228 56% 10%) 0%, hsl(228 40% 18%) 100%)",
                border: "1px solid hsl(228 10% 80%)",
              }}
            >
              <div className="absolute inset-0 dot-grid opacity-40" />
              <span
                className="absolute -bottom-8 -right-4 font-grotesk font-bold text-white/10 leading-none select-none transition-all duration-500"
                style={{ fontSize: "14rem" }}
              >
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">
                  Pain point en focus
                </span>
                <p className="font-grotesk text-white text-lg mt-2 leading-snug transition-opacity duration-300">
                  {painPoints[activeIdx].title}
                </p>
              </div>
            </div>

            {/* CTA — déplacé sous l'image, ancré dans le sticky */}
            <div className="max-w-sm mb-6">
              <p
                className="text-sm font-grotesk font-medium mb-3"
                style={{ color: "hsl(228 56% 10%)" }}
              >
                futur proche existe pour ces moments-là.
              </p>
              <Link
                to="/communaute"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-grotesk font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
              >
                Découvrir la communauté →
              </Link>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: "hsl(228 56% 10%)" }}
              >
                {String(activeIdx + 1).padStart(2, "0")} / {String(painPoints.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1.5">
                {painPoints.map((_, i) => (
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

          {/* Stacking cards right — each card wrapped in a tall rail so stacking is visible */}
          <div className="relative">
            {painPoints.map((p, idx) => {
              const topPx = 112 + idx * 16;
              return (
                <div
                  key={p.num}
                  className="relative lg:min-h-[70vh]"
                >
                  <div
                    ref={(el) => (cardRefs.current[idx] = el)}
                    className="lg:sticky"
                    style={{ top: `${topPx}px` }}
                  >
                    <div
                      className="bg-white rounded-xl p-7 md:p-10 transition-shadow duration-500"
                      style={{
                        border: "1px solid hsl(228 10% 85%)",
                        boxShadow: "0 20px 40px -25px hsl(228 56% 10% / 0.25)",
                      }}
                    >
                      <div className="flex items-baseline gap-4 mb-4">
                        <span
                          className="font-grotesk font-bold leading-none text-5xl md:text-6xl tabular-nums"
                          style={{ color: "hsl(228 56% 10% / 0.15)" }}
                        >
                          {p.num}
                        </span>
                        <span
                          className="font-mono text-[10px] uppercase tracking-[1.5px]"
                          style={{ color: "hsl(186 60% 32%)" }}
                        >
                          Pain point
                        </span>
                      </div>
                      <h3
                        className="text-xl md:text-2xl font-grotesk font-semibold mb-3 tracking-tight"
                        style={{ color: "hsl(228 56% 10%)" }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-base leading-relaxed" style={{ color: "hsl(228 15% 40%)" }}>
                        {p.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
