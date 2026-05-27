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

const PainItem = ({
  p,
  idx,
  onActive,
}: {
  p: typeof painPoints[number];
  idx: number;
  onActive: (i: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setRevealed(true);

    const revealObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          revealObs.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    const activeObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) onActive(idx);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    revealObs.observe(el);
    activeObs.observe(el);
    return () => {
      revealObs.disconnect();
      activeObs.disconnect();
    };
  }, [idx, onActive]);

  return (
    <div
      ref={ref}
      className="min-h-[55vh] flex flex-col justify-center py-10 border-t transition-all duration-700 ease-out"
      style={{
        borderColor: "hsl(228 10% 80%)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(40px)",
        filter: revealed ? "blur(0)" : "blur(6px)",
      }}
    >
      <span
        className="font-grotesk font-bold leading-none text-6xl md:text-7xl tabular-nums mb-5"
        style={{ color: "hsl(228 56% 10% / 0.14)" }}
      >
        {p.num}
      </span>
      <h3
        className="text-2xl md:text-3xl font-grotesk font-semibold mb-3 tracking-tight"
        style={{ color: "hsl(228 56% 10%)" }}
      >
        {p.title}
      </h3>
      <p className="text-base leading-relaxed max-w-xl" style={{ color: "hsl(228 15% 40%)" }}>
        {p.text}
      </p>
    </div>
  );
};

export const TensionSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="section-cream relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "hsl(186 79% 47%)" }}
      />
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT — sticky */}
          <div className="md:sticky md:top-28 md:self-start md:max-h-[calc(100vh-7rem)]">
            <span className="section-label">— Le constat</span>
            <h2
              className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight"
              style={{ color: "hsl(228 56% 10%)" }}
            >
              Vous connaissez sûrement ça.
            </h2>
            <div className="w-16 h-[3px] bg-primary mb-6 rounded-full" />
            <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(228 15% 40%)" }}>
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
                className="absolute -bottom-8 -right-4 font-grotesk font-bold text-white/10 leading-none select-none"
                style={{ fontSize: "14rem" }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">
                  Pain point en focus
                </span>
                <p className="font-grotesk text-white text-lg mt-2 leading-snug">
                  {painPoints[active].title}
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: "hsl(228 56% 10%)" }}
              >
                {String(active + 1).padStart(2, "0")} / {String(painPoints.length).padStart(2, "0")}
              </span>
              <div className="flex-1 h-px bg-[hsl(228_10%_80%)] overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((active + 1) / painPoints.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — scrollable */}
          <div>
            {painPoints.map((p, i) => (
              <PainItem key={p.num} p={p} idx={i} onActive={setActive} />
            ))}
            <div style={{ borderTop: "1px solid hsl(228 10% 80%)" }} />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <p className="text-base font-grotesk font-medium" style={{ color: "hsl(228 56% 10%)" }}>
              futur proche existe pour ces moments-là.
            </p>
            <Link
              to="/communaute"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-grotesk font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
            >
              Découvrir la communauté →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
