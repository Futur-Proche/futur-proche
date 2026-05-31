import { Link } from "react-router-dom";

export const CTASection = () => (
  <section className="relative overflow-hidden gradient-mesh-bg">
    {/* Floating orbs for depth */}
    <div className="orb orb--cyan w-[400px] h-[400px] top-[-20%] left-[20%]" />
    <div className="orb orb--violet w-[300px] h-[300px] bottom-[-10%] right-[15%]" />

    {/* Grain */}
    <div className="grain-overlay" />

    <div className="relative z-10 container mx-auto px-6 lg:px-12 py-20 md:py-28 text-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-grotesk font-medium tracking-tight text-white">
        Votre future{" "}
        <span className="font-serif-accent">(bonne)</span>{" "}
        décision commence ici.
      </h2>

      <div className="mt-8">
        <Link
          to="/candidater"
          className="bg-primary text-primary-foreground px-7 py-3.5 rounded-lg font-grotesk font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Devenir Futuriste →
        </Link>
      </div>
    </div>
  </section>
);
