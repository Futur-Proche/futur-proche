import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";

export const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-16">
    <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse 80% 100% at 90% 30%, hsl(186 79% 47% / 0.25) 0%, transparent 60%)"
      }}
    />

    <div className="container mx-auto px-6 py-20 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-3 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-primary">
              800+ leaders marketing & comm
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-grotesk font-medium leading-[1.05] tracking-tight">
            Les meilleures décisions ne se prennent pas{" "}
            <span className="font-serif-accent text-primary">seul.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            850+ leaders échangent chaque jour sur leurs vrais sujets. Les arbitrages en cours, les outils, les doutes : les décisions qui comptent.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/candidater"
              className="bg-primary text-primary-foreground px-7 py-3.5 rounded-lg font-grotesk font-medium text-base hover:opacity-90 transition-opacity"
            >
              Devenir Futuriste →
            </Link>
            <a
              href="#tension"
              className="border border-border text-foreground px-7 py-3.5 rounded-lg font-grotesk font-medium text-base hover:bg-secondary transition-colors flex items-center gap-2"
            >
              Découvrir la communauté <ArrowDown size={16} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="card-glass p-6">
            <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Futuristes</span>
            <p className="text-5xl font-grotesk font-bold text-primary mt-2">850+</p>
            <p className="text-sm text-muted-foreground mt-2">Leaders Marketing / Comm rassemblés. Tous secteurs, toutes tailles.</p>
          </div>
          <div className="card-glass p-6">
            <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Séniorité_Min</span>
            <p className="text-5xl font-grotesk font-bold text-primary mt-2">7 ans</p>
            <p className="text-sm text-muted-foreground mt-2">Filtre d'admission strict. CMO, VP, Directors, Heads of, indés seniors.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
