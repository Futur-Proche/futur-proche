import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";

export const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center pt-16 section-navy overflow-hidden">
    {/* Floating orbs */}
    <div className="orb orb--cyan w-[500px] h-[500px] top-[-10%] right-[-5%]" />
    <div className="orb orb--blue w-[400px] h-[400px] bottom-[-15%] left-[-10%]" />
    <div className="orb orb--violet w-[300px] h-[300px] top-[30%] left-[40%]" />

    {/* Dot grid */}
    <div className="dot-grid" />

    {/* Grain texture */}
    <div className="grain-overlay" />

    <div className="container relative z-10 mx-auto px-6 lg:px-12 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-primary">
              800+ leaders marketing & comm
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.6rem] font-grotesk font-bold leading-[1.06] tracking-tight text-white">
            Les meilleures décisions{" "}
            <br className="hidden md:block" />
            ne se prennent pas{" "}
            <span className="font-serif-accent text-primary italic">seul.</span>
          </h1>

          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-lg">
            850+ leaders Marketing / Comm échangent chaque jour sur leurs vrais sujets. Arbitrages, outils, doutes : l'espace où se prennent les décisions qui comptent.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/candidater"
              className="bg-primary text-primary-foreground px-7 py-3.5 rounded-lg font-grotesk font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Devenir Futuriste →
            </Link>
            <a
              href="#tension"
              className="border border-white/20 text-white px-7 py-3.5 rounded-lg font-grotesk font-medium text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              Découvrir <ArrowDown size={15} />
            </a>
          </div>
        </div>

        {/* Stats cards with halo */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-halo p-6">
            <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Commu_Active</span>
            <p className="text-5xl font-grotesk font-bold text-white mt-2">850<span className="text-3xl text-white align-top">+</span></p>
            <p className="text-sm text-white/50 mt-2">Leaders Marketing / Comm rassemblés. Tous secteurs, toutes tailles.</p>
          </div>
          <div className="card-halo p-6">
            <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Séniorité_Min</span>
            <p className="text-5xl font-grotesk font-bold text-white mt-2">7 <span className="text-3xl text-white">ans</span></p>
            <p className="text-sm text-white/50 mt-2">Filtre d'admission strict. CMO, VP, Directors, Heads of, indés seniors.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
