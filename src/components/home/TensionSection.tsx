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
  const desktopBreakpoint = 768;
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);

  useEffect(() => {
    const updateActiveCard = () => {
      if (window.innerWidth < desktopBreakpoint) return;

      const viewportCenter = window.innerHeight * 0.5;
      let closestIdx = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      stepRefs.current.forEach((step, idx) => {
        if (!step) return;
        const rect = step.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIdx = idx;
        }
      });

      setActiveIdx(closestIdx);
    };

    updateActiveCard();
    window.addEventListener("scroll", updateActiveCard, { passive: true });
    window.addEventListener("resize", updateActiveCard);

    return () => {
      window.removeEventListener("scroll", updateActiveCard);
      window.removeEventListener("resize", updateActiveCard);
    };
  }, []);

  useEffect(() => {
    if (pickedIdx === null) return;

    const releaseSelection = () => setPickedIdx(null);
    window.addEventListener("scroll", releaseSelection, { passive: true });

    return () => window.removeEventListener("scroll", releaseSelection);
  }, [pickedIdx]);

  const displayedIdx = pickedIdx ?? activeIdx;

  return (
    <section className="section-cream relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "hsl(186 79% 47%)" }}
      />

      <div className="hidden md:block">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-16 xl:gap-20">
            <div className="relative">
              <div className="sticky top-20 flex min-h-[calc(100vh-5rem)] items-start pt-10">
                <LeftColumn activeIdx={displayedIdx} />
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-20 flex min-h-[calc(100vh-5rem)] items-start pt-10">
                <DesktopStack displayedIdx={displayedIdx} onSelect={setPickedIdx} />
              </div>

              <div aria-hidden="true" className="pointer-events-none">
                {painPoints.map((point, idx) => (
                  <div
                    key={point.num}
                    ref={(el) => {
                      stepRefs.current[idx] = el;
                    }}
                    data-index={idx}
                    className={idx === painPoints.length - 1 ? "h-[65vh]" : "h-[62vh]"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden container mx-auto px-6 py-20">
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
                  <p
                    className="font-grotesk text-base font-semibold leading-snug tracking-tight"
                    style={{ color: "hsl(228 56% 10%)" }}
                  >
                    {p.title}
                  </p>
                </div>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: open ? 400 : 0,
                    opacity: open ? 1 : 0,
                    marginTop: open ? 16 : 0,
                  }}
                >
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

const DesktopStack = ({
  displayedIdx,
  onSelect,
}: {
  displayedIdx: number;
  onSelect: (idx: number) => void;
}) => {
  const collapsedHeight = 58;
  const expandedHeight = 240;
  const futurePeek = 18;

  return (
    <div
      className="relative w-full"
      style={{ height: "min(560px, calc(100vh - 10rem))", minHeight: 500 }}
    >
      {painPoints.map((point, idx) => {
        const isActive = idx === displayedIdx;
        const isPast = idx < displayedIdx;
        const top = isPast
          ? idx * collapsedHeight
          : isActive
            ? idx * collapsedHeight
            : displayedIdx * collapsedHeight + expandedHeight + (idx - displayedIdx - 1) * futurePeek;

        const scale = isPast ? 1 : isActive ? 1 : 1 - Math.min(idx - displayedIdx, 3) * 0.02;
        const opacity = isPast ? 1 : isActive ? 1 : Math.max(0.5, 1 - (idx - displayedIdx) * 0.12);
        const zIndex = isActive ? painPoints.length + 10 : isPast ? painPoints.length + idx : painPoints.length - idx;

        return (
          <button
            key={point.num}
            type="button"
            aria-expanded={isActive}
            onClick={() => onSelect(idx)}
            className="absolute inset-x-0 overflow-hidden rounded-[22px] text-left transition-all duration-500 ease-out motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            style={{
              top,
              height: isActive ? expandedHeight : collapsedHeight,
              transform: `scale(${scale})`,
              transformOrigin: "center top",
              opacity,
              zIndex,
              background: "hsl(0 0% 100%)",
              border: "1px solid hsl(228 10% 88%)",
              boxShadow: isActive
                ? "0 32px 60px -34px hsl(228 56% 10% / 0.22), 0 18px 36px -28px hsl(228 56% 10% / 0.14)"
                : "0 14px 26px -22px hsl(228 56% 10% / 0.18)",
            }}
          >
            <div className="flex h-full flex-col px-8 py-6">
              <div className="flex items-start gap-5">
                <span
                  className="font-grotesk text-5xl font-bold leading-none tabular-nums"
                  style={{ color: "hsl(228 56% 10% / 0.14)" }}
                >
                  {point.num}
                </span>

                <div className="min-w-0 pt-1.5">
                  <p
                    className="font-grotesk font-semibold leading-tight tracking-tight transition-all duration-500 motion-reduce:transition-none"
                    style={{
                      color: "hsl(228 56% 10%)",
                      fontSize: isActive ? "1.5rem" : "1rem",
                    }}
                  >
                    {point.title}
                  </p>
                </div>
              </div>

              <div
                className="overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none"
                style={{
                  maxHeight: isActive ? 220 : 0,
                  opacity: isActive ? 1 : 0,
                  marginTop: isActive ? 18 : 0,
                }}
              >
                <p
                  className="max-w-[46ch] text-base leading-relaxed"
                  style={{ color: "hsl(228 15% 40%)" }}
                >
                  {point.text}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

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
              En focus
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
