import { Link } from "react-router-dom";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";

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
  const { ref, revealed } = useStaggeredReveal<HTMLDivElement>(painPoints.length, 130, 0.15);

  return (
    <section className="section-cream relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "hsl(186 79% 47%)" }}
      />
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="max-w-3xl mb-14">
          <span className="section-label">— Le constat</span>
          <h2
            className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight"
            style={{ color: "hsl(228 56% 10%)" }}
          >
            Vous connaissez sûrement ça.
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-6 rounded-full" />
          <p className="text-base leading-relaxed" style={{ color: "hsl(228 15% 40%)" }}>
            Plus le poste est senior, plus les décisions sont solitaires. Et plus l'impact d'une mauvaise décision est visible.
          </p>
        </div>

        <div ref={ref} className="max-w-4xl mx-auto">
          {painPoints.map((p, i) => {
            const on = revealed[i];
            return (
              <div
                key={p.num}
                className="group relative grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-start py-7 md:py-9 border-t transition-all duration-700 ease-out hover:bg-[hsl(186_79%_47%/0.04)]"
                style={{
                  borderColor: "hsl(228 10% 80%)",
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(40px)",
                  filter: on ? "blur(0)" : "blur(6px)",
                }}
              >
                <span
                  className="font-grotesk font-bold leading-none text-5xl md:text-7xl tabular-nums transition-colors duration-500 group-hover:text-[hsl(186_79%_47%)]"
                  style={{ color: "hsl(228 56% 10% / 0.12)" }}
                >
                  {p.num}
                </span>
                <div className="pt-1 md:pt-3">
                  <h3
                    className="text-xl md:text-2xl font-grotesk font-semibold mb-2 tracking-tight"
                    style={{ color: "hsl(228 56% 10%)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: "hsl(228 15% 40%)" }}>
                    {p.text}
                  </p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid hsl(228 10% 80%)" }} />
        </div>

        <div className="mt-14 pt-8 max-w-4xl mx-auto">
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
