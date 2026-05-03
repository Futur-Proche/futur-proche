import { Link } from "react-router-dom";

export const CTASection = () => (
  <section className="relative overflow-hidden gradient-mesh-bg">
    <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 text-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-grotesk font-medium tracking-tight">
        Votre prochaine{" "}
        <span className="font-serif-accent">(bonne)</span>{" "}
        décision commence ici.
      </h2>

      <div className="mt-10">
        <Link
          to="/candidater"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-grotesk font-medium text-base hover:opacity-90 transition-opacity"
        >
          Devenir Futuriste →
        </Link>
      </div>
    </div>
  </section>
);
