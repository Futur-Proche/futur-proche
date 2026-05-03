import { Link } from "react-router-dom";

export const CTASection = () => (
  <section className="relative overflow-hidden gradient-mesh-bg">
    <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 text-center">
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Rejoindre</span>
      </div>

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-grotesk font-medium tracking-tight mb-2">
        Prêt·e à rejoindre{" "}
        <span className="font-serif-accent">les Futuristes</span> ?
      </h2>
      <p className="text-lg text-muted-foreground mt-4 mb-10">
        Candidature en 2 minutes. Réponse sous 48h.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/candidater"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-grotesk font-medium text-base hover:opacity-90 transition-opacity"
        >
          Je candidate →
        </Link>
        <Link
          to="/ressources"
          className="border border-border text-foreground px-8 py-4 rounded-lg font-grotesk font-medium text-base hover:bg-secondary transition-colors"
        >
          Voir les ressources
        </Link>
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[1.2px] text-muted-foreground mt-8">
        99€/an · Tarif Founding · 99 places
      </p>
    </div>
  </section>
);
