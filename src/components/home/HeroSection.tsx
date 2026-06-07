import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import communityGroup from "@/assets/community-group.jpg";
import networkingEchanges from "@/assets/networking-echanges.jpg";

const rotatingPhrases = [
  "ne se prennent pas seul.",
  "se confrontent entre pairs.",
  "se valident sur le terrain.",
  "ont déjà été testées ici.",
  "sont rarement les plus simples.",
  "naissent de la confrontation.",
  "se prennent mieux à plusieurs.",
  "méritent un regard extérieur.",
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const rotate = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingPhrases.length);
      setIsAnimating(false);
    }, 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(rotate, 3500);
    return () => clearInterval(interval);
  }, [rotate]);

  const currentPhrase = rotatingPhrases[currentIndex];
  // Extract last word for serif accent
  const words = currentPhrase.split(" ");
  const lastWord = words[words.length - 1];
  const beforeLastWord = words.slice(0, -1).join(" ");

  return (
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
              <span
                className={`inline-block transition-all duration-400 ${
                  isAnimating
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
                style={{ transition: "opacity 0.4s ease, transform 0.4s ease" }}
              >
                {beforeLastWord}{" "}
                <span className="font-serif-accent text-primary italic">{lastWord}</span>
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-lg">
              850+ leaders Marketing / Comm échangent chaque jour sur leurs vrais sujets. Arbitrages, outils, doutes :{" "}
              <span
                className="font-medium text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, hsl(186 79% 47% / 0.28) 0%, hsl(186 79% 47% / 0.28) 38%, transparent 38%)",
                }}
              >
                l'espace où se prennent les décisions qui comptent.
              </span>
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
};
