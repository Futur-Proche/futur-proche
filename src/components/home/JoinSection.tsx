import { ClipboardList, Eye, Rocket } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    tag: "01",
    title: "Candidature",
    desc: "Un formulaire rapide (2 minutes). Parcours, poste actuel, motivation.",
  },
  {
    icon: Eye,
    tag: "02",
    title: "Review",
    desc: "L'équipe Onboarding examine chaque profil : expérience (7+ ans), poste en cours et passés, personnalité & expériences diverses.",
  },
  {
    icon: Rocket,
    tag: "03",
    title: "Intégration",
    desc: "Accès à la communauté WhatsApp, séquence d'onboarding, présentation aux membres, invitation aux prochains événements, ressources et opportunités.",
  },
];

export const JoinSection = () => {
  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full" style={{ background: "hsl(186 60% 32%)" }} />
          <span className="section-label">Rejoindre</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10" style={{ color: "hsl(228 56% 10%)" }}>
          Comment devenir{" "}
          <span className="font-serif-accent" style={{ color: "hsl(186 60% 32%)" }}>Futuriste</span> ?
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((s) => (
            <div
              key={s.tag}
              className="bg-white rounded-xl p-7 flex flex-col card-lift"
              style={{ border: "1px solid hsl(228 10% 85%)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(186 79% 47% / 0.12)" }}
                >
                  <s.icon size={20} style={{ color: "hsl(186 60% 32%)" }} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(186 60% 32%)" }}>
                  {s.tag}
                </span>
              </div>
              <h3 className="text-lg font-grotesk font-semibold mb-2" style={{ color: "hsl(228 56% 10%)" }}>
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 45%)" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Why — discrete callout */}
        <div
          className="rounded-lg px-5 py-4 md:px-6 md:py-5 border-dashed"
          style={{
            background: "hsl(228 24% 96%)",
            border: "1px dashed hsl(228 15% 80%)",
          }}
        >
          <p className="text-xs md:text-sm leading-relaxed max-w-3xl" style={{ color: "hsl(228 12% 50%)" }}>
            <span className="font-grotesk font-semibold" style={{ color: "hsl(228 12% 38%)" }}>
              Pourquoi un process de sélection ?
            </span>{" "}
            Parce que la valeur de Futur Proche repose sur la qualité de chaque membre. On ne cherche pas à grossir sans boussole — on s'assure que la communauté gagne en valeur à chaque nouveau Futuriste.
          </p>
        </div>
      </div>
    </section>
  );
};
