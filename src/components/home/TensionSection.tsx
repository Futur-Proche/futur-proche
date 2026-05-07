import { Link } from "react-router-dom";
import { useState } from "react";
import { AlertCircle, Users, Clock } from "lucide-react";

const painPoints = [
  {
    num: "01",
    icon: AlertCircle,
    title: "Un budget à défendre seul.",
    text: "Personne autour de vous pour challenger vos arbitrages. Le ComEx attend des résultats, pas des explications.",
  },
  {
    num: "02",
    icon: Clock,
    title: "Des décisions qui n'attendent pas.",
    text: "Changer de CRM, lancer un canal, couper un budget — pas le temps de lancer un appel d'offres ou de mandater un cabinet.",
  },
  {
    num: "03",
    icon: Users,
    title: "L'isolement du leader Marketing.",
    text: "Un doute sur un outil, un prestataire, une stratégie. Des dizaines de contenus en ligne, mais aucune réponse de quelqu'un qui a vécu la même chose.",
  },
];

export const TensionSection = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="section-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "hsl(186 79% 47%)" }}
      />
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="max-w-3xl mb-12">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {painPoints.map((p) => {
            const isHovered = hovered === p.num;
            return (
              <div
                key={p.num}
                className="relative rounded-xl p-7 transition-all duration-500 group cursor-default"
                style={{
                  background: isHovered ? "hsl(228 56% 10%)" : "white",
                  border: isHovered ? "1px solid hsl(186 79% 47% / 0.3)" : "1px solid hsl(228 10% 85%)",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 20px 40px -15px hsl(228 56% 10% / 0.25)" : "none",
                }}
                onMouseEnter={() => setHovered(p.num)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Number + Icon */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300"
                    style={{
                      background: isHovered ? "hsl(186 79% 47% / 0.15)" : "hsl(186 79% 47% / 0.08)",
                    }}
                  >
                    <p.icon
                      size={20}
                      className="transition-colors duration-300"
                      style={{ color: isHovered ? "hsl(186 79% 47%)" : "hsl(186 60% 32%)" }}
                    />
                  </div>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[1.5px] transition-colors duration-300"
                    style={{ color: isHovered ? "hsl(186 79% 47%)" : "hsl(186 60% 32%)" }}
                  >
                    {p.num}
                  </span>
                </div>

                <h3
                  className="text-lg font-grotesk font-semibold mb-3 transition-colors duration-300"
                  style={{ color: isHovered ? "white" : "hsl(228 56% 10%)" }}
                >
                  {p.title}
                </h3>

                <p
                  className="text-sm leading-relaxed transition-colors duration-300"
                  style={{ color: isHovered ? "hsl(0 0% 100% / 0.6)" : "hsl(228 15% 40%)" }}
                >
                  {p.text}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-7 right-7 h-[2px] rounded-full transition-all duration-500"
                  style={{
                    background: "hsl(186 79% 47%)",
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA with separator line */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid hsl(228 10% 85%)" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <p className="text-base font-grotesk font-medium" style={{ color: "hsl(228 56% 10%)" }}>
              futur proche existe pour ces moments-là.
            </p>
            <Link
              to="/communaute"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-grotesk font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: "hsl(186 79% 47%)",
                color: "hsl(228 56% 10%)",
              }}
            >
              Découvrir la communauté →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
