import { Link } from "react-router-dom";

export const TensionSection = () => (
  <section id="tension" className="section-cream">
    <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
      <span className="section-label">— Le constat</span>
      <h2 className="text-3xl md:text-4xl font-grotesk font-medium mt-3 mb-6 tracking-tight">
        Le Marketing est trop exigeant pour être pratiqué{" "}
        <span className="font-serif-accent">seul(e).</span>
      </h2>

      <p className="text-base md:text-lg leading-relaxed max-w-3xl text-cream-muted">
        Un budget à défendre, aucun collègue aligné sur vos enjeux. Une décision à prendre, pas le temps de faire appel à un cabinet. Un doute sur un outil, un prestataire, une stratégie, une nouvelle techno, personne à qui poser la question autour de vous.{" "}
        <span className="font-medium" style={{ color: "hsl(228 56% 10%)" }}>futur proche existe pour ces moments-là.</span>
      </p>

      <Link
        to="/communaute"
        className="inline-flex items-center gap-2 mt-8 font-grotesk font-medium text-sm hover:opacity-80 transition-opacity"
        style={{ color: "hsl(186 60% 32%)" }}
      >
        Découvrir la communauté →
      </Link>
    </div>
  </section>
);
