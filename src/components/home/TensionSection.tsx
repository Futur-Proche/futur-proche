import { Link } from "react-router-dom";

export const TensionSection = () => (
  <section id="tension" className="mode-lecture">
    <div className="container mx-auto px-6 py-24 md:py-32">
      <span className="section-label">— Le constat</span>
      <h2 className="text-3xl md:text-4xl font-grotesk font-medium mt-4 mb-8 tracking-tight text-foreground">
        Le Marketing est trop exigeant pour être pratiqué{" "}
        <span className="font-serif-accent">seul(e).</span>
      </h2>

      <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-3xl">
        Un budget à défendre, aucun collègue aligné sur vos enjeux. Une décision à prendre, pas le temps de faire appel à un cabinet. Un doute sur un outil, un prestataire, une stratégie, une nouvelle techno, personne à qui poser la question autour de vous.{" "}
        <span className="text-foreground font-medium">futur proche existe pour ces moments-là.</span>
      </p>

      <Link
        to="/communaute"
        className="inline-flex items-center gap-2 mt-10 text-primary font-grotesk font-medium text-base hover:opacity-80 transition-opacity"
      >
        Découvrir la communauté →
      </Link>
    </div>
  </section>
);
