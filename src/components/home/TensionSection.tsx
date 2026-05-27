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
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);

  // Scroll-driven active index (desktop only — uses sticky stage)
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Section is taller than viewport; map scroll progress to step index
      const total = rect.height - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      // 6 steps -> indexes 0..5
      const idx = Math.min(
        painPoints.length - 1,
        Math.floor(progress * painPoints.length)
      );
      setActiveIdx(idx);
      // Reset manual pick when user scrolls
      setPickedIdx(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const displayedIdx = pickedIdx ?? activeIdx;

  return (
    <section
      ref={sectionRef}
      className="section-cream relative overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "hsl(186 79% 47%)" }}
      />

      {/* Desktop: pinned stage — height drives scroll-progress */}
      <div className="hidden lg:block" style={{ height: `${painPoints.length * 90}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="container mx-auto px-6 lg:px-12 w-full">
            <div className="grid grid-cols-[1fr_1.2fr] gap-20 items-center">
              {/* LEFT — fixed column */}
              <LeftColumn activeIdx={displayedIdx} />

              {/* RIGHT — stacking cards */}
              <div className="relative h-[560px]">
                {painPoints.map((p, idx) => {
                  const isActive = idx === displayedIdx;
                  const isPast = idx < displayedIdx;
                  const isFuture = idx > displayedIdx;

                  // Position math:
                  // - Past cards: stacked above with growing offset upward, only header visible
                  // - Active card: anchored, full content
                  // - Future cards: peek behind active with header visible, slight offset down
                  const offsetFromActive = idx - displayedIdx;

                  let translateY = 0;
                  let zIndex = painPoints.length - Math.abs(offsetFromActive);
                  let scale = 1;
                  let opacity = 1;

                  if (isActive) {
                    translateY = 0;
                    zIndex = painPoints.length + 10;
                    scale = 1;
                  } else if (isPast) {
                    // stacked above
                    translateY = -90 - (displayedIdx - idx - 1) * 14;
                    scale = 1 - (displayedIdx - idx) * 0.015;
                    opacity = 1;
                  } else if (isFuture) {
                    // peek below from behind
                    translateY = 14 * (idx - displayedIdx);
                    scale = 1 - (idx - displayedIdx) * 0.02;
                    opacity = 1;
                  }

                  return (
                    <button
                      key={p.num}
                      type="button"
                      onClick={() => setPickedIdx(idx)}
                      className="absolute left-0 right-0 top-0 text-left rounded-2xl transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                      style={{
                        transform: `translateY(${translateY}px) scale(${scale})`,
                        transformOrigin: "center top",
                        zIndex,
                        opacity,
                        background: "hsl(0 0% 100%)",
                        border: "1px solid hsl(228 10% 88%)",
                        boxShadow: isActive
                          ? "0 30px 60px -30px hsl(228 56% 10% / 0.25), 0 10px 20px -10px hsl(228 56% 10% / 0.10)"
                          : "0 10px 30px -20px hsl(228 56% 10% / 0.18)",
                        cursor: "pointer",
                      }}
                    >
                      <div className="p-8 md:p-10">
                        <div className="flex items-baseline gap-5">
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

                        {/* Body — only visible on active card */}
                        <div
                          className="overflow-hidden transition-all duration-500 ease-out"
                          style={{
                            maxHeight: isActive ? 400 : 0,
                            opacity: isActive ? 1 : 0,
                            marginTop: isActive ? 24 : 0,
                          }}
                        >
                          <h3
                            className="text-xl md:text-2xl font-grotesk font-semibold mb-3 tracking-tight"
                            style={{ color: "hsl(228 56% 10%)" }}
                          >
                            {p.title}
                          </h3>
                          <p
                            className="text-base leading-relaxed max-w-[52ch]"
                            style={{ color: "hsl(228 15% 40%)" }}
                          >
                            {p.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet — accordion fallback */}
      <div className="lg:hidden container mx-auto px-6 py-20">
        <LeftColumn activeIdx={displayedIdx} compact />
        <div className="mt-12 space-y-4">
          {painPoints.map((p, idx) => {
            const open = idx === displayedIdx;
            return (
              <button
                key={p.num}
                type="button"
                onClick={() => setPickedIdx(idx)}
                className="w-full text-left rounded-2xl p-6 transition-all duration-300"
                style={{
                  background: "hsl(0 0% 100%)",
                  border: "1px solid hsl(228 10% 88%)",
                  boxShadow: "0 10px 30px -20px hsl(228 56% 10% / 0.18)",
                }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-grotesk font-bold leading-none text-4xl tabular-nums"
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
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: open ? 400 : 0,
                    opacity: open ? 1 : 0,
                    marginTop: open ? 16 : 0,
                  }}
                >
                  <h3
                    className="text-lg font-grotesk font-semibold mb-2 tracking-tight"
                    style={{ color: "hsl(228 56% 10%)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 40%)" }}>
                    {p.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ---- Sub-component: left column (shared desktop/mobile) ----
const LeftColumn = ({ activeIdx, compact = false }: { activeIdx: number; compact?: boolean }) => {
  return (
    <div>
      <span className="section-label">— Le constat</span>
      <h2
        className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight"
        style={{ color: "hsl(228 56% 10%)" }}
      >
        Vous connaissez sûrement ça.
      </h2>
      <div className="w-16 h-[3px] bg-primary mb-6 rounded-full" />
      <p
        className="text-base leading-relaxed mb-8 max-w-md"
        style={{ color: "hsl(228 15% 40%)" }}
      >
        Plus le poste est senior, plus les décisions sont solitaires. Et plus l'impact d'une
        mauvaise décision est visible.
      </p>

      {!compact && (
        <div
          className="relative aspect-[5/4] max-w-sm overflow-hidden rounded-lg mb-6"
          style={{
            background:
              "linear-gradient(135deg, hsl(228 56% 10%) 0%, hsl(228 40% 18%) 100%)",
            border: "1px solid hsl(228 10% 80%)",
          }}
        >
          <div className="absolute inset-0 dot-grid opacity-40" />
          <span
            className="absolute -bottom-8 -right-4 font-grotesk font-bold text-white/10 leading-none select-none transition-all duration-500"
            style={{ fontSize: "12rem" }}
          >
            {String(activeIdx + 1).padStart(2, "0")}
          </span>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">
              Pain point en focus
            </span>
            <p className="font-grotesk text-white text-base mt-2 leading-snug transition-opacity duration-300">
              {painPoints[activeIdx].title}
            </p>
          </div>
        </div>
      )}

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
  );
};
