import { Check, X } from "lucide-react";

const yes = [
  "Tu as 7+ ans d'expérience en marketing ou communication",
  "Tu es CMO, VP, Director, Head of, ou senior manager",
  "Tu préfères les conversations cash aux discours corporate",
  "Tu veux donner autant que recevoir",
];

const no = [
  'Tu cherches des "hacks" ou des raccourcis',
  "Tu veux vendre tes services à la communauté",
  "Tu débutes dans le métier",
];

export const ForWhoSection = () => (
  <section className="bg-background">
    <div className="container mx-auto px-6 py-24 md:py-32">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Pour qui</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-grotesk font-medium tracking-tight mb-12">
        C'est pour toi si...
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[1.2px] text-primary mb-6">— Oui</p>
          <div className="space-y-4">
            {yes.map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-base text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[1.2px] text-muted-foreground mb-6">— Non</p>
          <div className="space-y-4">
            {no.map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-base text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
