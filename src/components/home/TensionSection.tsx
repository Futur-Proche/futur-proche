import { Link } from "react-router-dom";

const painPoints = [
  {
    num: 1,
    text: "On nous demande\nde faire plus avec moins",
  },
  {
    num: 2,
    text: "On doit devenir\nAI natif en 24h",
  },
  {
    num: 3,
    text: "Le scope du marketing\nn'a jamais été si large",
  },
];

export const TensionSection = () => {
  return (
    <section className="section-navy relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        {/* Dark gradient card */}
        <div
          className="relative rounded-2xl px-8 py-14 md:px-14 md:py-20 overflow-hidden"
          style={{
            background: "linear-gradient(160deg, hsl(228 56% 18%) 0%, hsl(228 56% 10%) 100%)",
            border: "1px solid hsl(228 30% 22%)",
          }}
        >
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, hsl(228 40% 28%) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-grotesk font-bold text-white text-center mb-14 leading-snug">
              <span className="font-serif italic text-white/80">Parce que</span> le quotidien des leaders Marketing / Comm,
              <br className="hidden md:block" />
              <span className="text-primary"> ce n'est pas de la tarte…</span>
            </h2>

            {/* 3 pain points with coral circles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-14">
              {painPoints.map((p) => (
                <div key={p.num} className="flex flex-col items-center text-center">
                  {/* Coral numbered circle */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-grotesk font-bold text-lg mb-5 shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(8 85% 65%) 0%, hsl(15 90% 58%) 100%)",
                      boxShadow: "0 4px 20px hsl(8 85% 65% / 0.35)",
                    }}
                  >
                    {p.num}
                  </div>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed font-medium whitespace-pre-line">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom punchline */}
            <p className="text-center text-white/50 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
              …il est temps de sortir de ce cycle.{" "}
              <Link to="/communaute" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Appuie-toi sur les meilleurs leaders Marketing / Comm pour accélérer ton impact&nbsp;→
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
