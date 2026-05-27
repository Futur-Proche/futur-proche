import { Link } from "react-router-dom";
import { useInViewReveal } from "@/hooks/useInViewReveal";
import { Play, ArrowRight } from "lucide-react";

/**
 * Bloc vidéo de présentation, inséré après TensionSection.
 * Placeholder vidéo (à remplacer par l'URL fournie par le client) sur fond navy,
 * encadré par les accents cyan/cream de la charte Futur Proche.
 */
export const VideoSection = () => {
  const header = useInViewReveal<HTMLDivElement>(0.25);
  const card = useInViewReveal<HTMLDivElement>(0.2);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "hsl(228 56% 10%)", color: "hsl(40 33% 94%)" }}
    >
      <div className="dot-grid" />
      {/* Orbes décoratives */}
      <div
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full opacity-[0.10] blur-3xl pointer-events-none"
        style={{ background: "hsl(186 79% 47%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "hsl(45 100% 60%)" }}
      />

      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
        {/* En-tête */}
        <div
          ref={header.ref}
          className="max-w-3xl mx-auto text-center mb-12 md:mb-16 transition-all duration-1000 ease-out"
          style={{
            opacity: header.revealed ? 1 : 0,
            transform: header.revealed ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "hsl(186 79% 47%)" }}
            />
            <span className="section-label">— Futur Proche en 90 secondes</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-grotesk font-bold tracking-tight leading-[1.15] mb-5 text-white">
            Découvrez la communauté{" "}
            <span className="font-serif-accent italic text-primary">
              de l'intérieur.
            </span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-white/65 max-w-2xl mx-auto">
            Une vidéo courte pour ressentir l'ambiance, les visages et le ton des
            échanges entre Futuristes. Plus parlant qu'un long discours.
          </p>
        </div>

        {/* Lecteur vidéo (placeholder) */}
        <div
          ref={card.ref}
          className="max-w-5xl mx-auto transition-all duration-1000 ease-out"
          style={{
            opacity: card.revealed ? 1 : 0,
            transform: card.revealed ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
            transitionDelay: "120ms",
          }}
        >
          <div className="relative">
            {/* Cadre + glow cyan */}
            <div
              className="absolute -inset-px rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, hsl(186 79% 47% / 0.5), transparent 40%, hsl(45 100% 60% / 0.3))",
                filter: "blur(0.5px)",
              }}
            />
            <div
              className="relative rounded-2xl overflow-hidden aspect-video"
              style={{
                background:
                  "linear-gradient(135deg, hsl(228 40% 14%), hsl(228 56% 10%))",
                border: "1px solid hsl(228 30% 22%)",
                boxShadow:
                  "0 40px 80px -30px hsl(186 79% 47% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
              }}
            >
              {/* Trame futuriste */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(186 79% 47%) 1px, transparent 1px), linear-gradient(90deg, hsl(186 79% 47%) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />

              {/* Coins cyan */}
              <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 border-primary opacity-80" />
              <div className="absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 border-primary opacity-80" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 border-primary opacity-80" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-primary opacity-80" />

              {/* Étiquette de coin */}
              <div className="absolute top-5 left-16 font-mono text-[10px] uppercase tracking-[1.5px] text-primary/70">
                REEL_2026 · FP.MOV
              </div>
              <div className="absolute bottom-5 right-16 font-mono text-[10px] uppercase tracking-[1.5px] text-white/40">
                01:30
              </div>

              {/* Bouton play central */}
              <button
                type="button"
                aria-label="Lire la vidéo de présentation"
                className="group absolute inset-0 flex items-center justify-center"
              >
                <span
                  className="absolute w-28 h-28 rounded-full transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background: "hsl(186 79% 47% / 0.18)",
                    boxShadow: "0 0 0 1px hsl(186 79% 47% / 0.35)",
                  }}
                />
                <span
                  className="absolute w-40 h-40 rounded-full animate-ping opacity-30"
                  style={{ background: "hsl(186 79% 47% / 0.25)" }}
                />
                <span
                  className="relative flex items-center justify-center w-20 h-20 rounded-full transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: "hsl(186 79% 47%)",
                    boxShadow:
                      "0 20px 40px -10px hsl(186 79% 47% / 0.6), inset 0 1px 0 hsl(0 0% 100% / 0.2)",
                  }}
                >
                  <Play
                    className="w-7 h-7 fill-current"
                    style={{ color: "hsl(228 56% 10%)", marginLeft: 3 }}
                  />
                </span>
              </button>

              {/* Légende discrète bas */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 text-center">
                <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/40">
                  Vidéo de présentation
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/candidater"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-grotesk font-medium text-sm tracking-tight transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "hsl(186 79% 47%)",
                color: "hsl(228 56% 10%)",
                boxShadow: "0 10px 30px -10px hsl(186 79% 47% / 0.5)",
              }}
            >
              Devenir Futuriste
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/communaute"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-grotesk font-medium text-sm tracking-tight border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors"
            >
              Explorer la communauté
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
