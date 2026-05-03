import { Check, X } from "lucide-react";

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

export const ForYouSection = () => (
  <section className="section-navy border-t border-border">
    <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Pour qui</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
        C'est pour vous si...
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* OUI */}
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-white/40 mb-5 block">— Oui</span>
          <ul className="space-y-4">
            {yesItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-base font-medium leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* NON */}
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-white/40 mb-5 block">— Non</span>
          <ul className="space-y-4">
            {noItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <X size={18} className="text-white/30 mt-0.5 flex-shrink-0" />
                <span className="text-white/40 text-base leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
