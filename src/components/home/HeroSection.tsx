import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import communityGroup from "@/assets/community-group.jpg";
import foundersAsset from "@/assets/membres-fondateurs.jpg.asset.json";

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
                850+ LEADERS MARKETING & COMM
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

          {/* Photo composition — la communauté incarnée */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* Halo cyan derrière */}
              <div
                className="absolute -inset-6 rounded-3xl pointer-events-none opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 70% 30%, hsl(186 79% 47% / 0.35), transparent 70%)",
                }}
              />

              {/* Image principale */}
              <div
                className="relative rounded-2xl overflow-hidden aspect-[4/5]"
                style={{
                  border: "1px solid hsl(228 30% 22%)",
                  boxShadow:
                    "0 40px 80px -30px hsl(186 79% 47% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
                }}
              >
                <img
                  src={communityGroup}
                  alt="La communauté Futur Proche réunie lors d'un After Proche"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Coins futuristes cyan */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary opacity-80" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary opacity-80" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary opacity-80" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary opacity-80" />


                {/* Dégradé bas pour lisibilité */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(228 56% 10% / 0.85), transparent)",
                  }}
                />
              </div>

              {/* Polaroïd secondaire — desktop only */}
              <div
                className="hidden md:block absolute -bottom-8 -left-10 w-40 lg:w-48 rotate-[-6deg] rounded-lg overflow-hidden"
                style={{
                  border: "3px solid hsl(40 33% 94%)",
                  boxShadow: "0 20px 40px -10px hsl(228 56% 5% / 0.6)",
                }}
              >
                <div className="aspect-[4/5]">
                  <img
                    src={networkingEchanges}
                    alt="Échanges entre Futuristes"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Pastille preuve sociale */}
              <div
                className="absolute -bottom-4 right-4 md:right-6 flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md"
                style={{
                  background: "hsl(228 56% 10% / 0.85)",
                  border: "1px solid hsl(186 79% 47% / 0.5)",
                  boxShadow: "0 10px 30px -10px hsl(186 79% 47% / 0.5)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-white">
                  AMBIANCE APRES UN AFTER PROCHE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
