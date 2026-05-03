import { Check, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const yesItems = [
  "Vous avez 7+ ans d'expérience en Marketing / Comm",
  "Vous êtes CMO, VP, Director, Head of, ou senior manager",
  "Vous préférez les conversations franches aux discours corporate",
  "Vous voulez donner autant que recevoir",
];

const noItems = [
  "Vous cherchez des \"hacks\" ou des raccourcis",
  "Vous voulez vendre vos services à la communauté",
  "Vous débutez dans le métier",
];

export const ForYouSection = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-cream">
      <div ref={ref} className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ background: "hsl(186 60% 32%)" }} />
          <span className="section-label">Pour qui</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10" style={{ color: "hsl(228 56% 10%)" }}>
          C'est pour vous si...
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* OUI */}
          <div className="bg-white rounded-xl p-8 card-lift" style={{ border: "1px solid hsl(228 10% 85%)" }}>
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5 block" style={{ color: "hsl(228 15% 55%)" }}>— Oui</span>
            <ul className="space-y-4">
              {yesItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(186 60% 32%)" }} />
                  <span className="text-base font-medium leading-snug" style={{ color: "hsl(228 56% 10%)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NON */}
          <div className="bg-white rounded-xl p-8 card-lift" style={{ border: "1px solid hsl(228 10% 85%)" }}>
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5 block" style={{ color: "hsl(228 15% 55%)" }}>— Non</span>
            <ul className="space-y-4">
              {noItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X size={18} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(228 15% 70%)" }} />
                  <span className="text-base leading-snug" style={{ color: "hsl(228 15% 45%)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
