import { Link } from "react-router-dom";

const painPoints = [
  {
    num: "01",
    text: "Un budget à défendre, aucun collègue aligné sur vos enjeux.",
  },
  {
    num: "02",
    text: "Une décision à prendre, pas le temps de faire appel à un cabinet.",
  },
  {
    num: "03",
    text: "Un doute sur un outil, un prestataire, une stratégie, une nouvelle techno — personne à qui poser la question autour de vous.",
  },
];

export const TensionSection = () => {
  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <span className="section-label">— Le constat</span>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-2 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
          Vous connaissez sûrement ça.
        </h2>

        <div className="w-16 h-[3px] bg-primary mb-10 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {painPoints.map((p) => (
            <div key={p.num} className="border-t pt-5" style={{ borderColor: "hsl(228 10% 80%)" }}>
              <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-primary">{p.num}</span>
              <p className="text-base leading-relaxed mt-3" style={{ color: "hsl(228 15% 30%)" }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>

        <Link
          to="/communaute"
          className="inline-flex items-center gap-2 mt-10 font-grotesk font-semibold text-base hover:opacity-80 transition-opacity"
          style={{ color: "hsl(186 60% 32%)" }}
        >
          futur proche existe pour ces moments-là&nbsp;→
        </Link>
      </div>
    </section>
  );
};
