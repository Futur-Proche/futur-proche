const testimonials = [
  {
    quote: "Enfin un endroit où poser mes vraies questions sans passer pour un junior.",
    name: "Camille L.",
    initials: "CL",
    role: "CMO · scaleup B2B SaaS",
  },
  {
    quote: "J'ai trouvé mon prochain CMO part-time via fp. En 48h.",
    name: "Antoine M.",
    initials: "AM",
    role: "CEO · PME industrielle",
  },
  {
    quote: "Les After Proche, c'est le seul event où je reviens systématiquement.",
    name: "Sophie R.",
    initials: "SR",
    role: "Head of Marketing · grand groupe",
  },
  {
    quote: "Le niveau des échanges est incomparable avec n'importe quel groupe LinkedIn.",
    name: "Thomas D.",
    initials: "TD",
    role: "VP Marketing · scale-up",
  },
  {
    quote: "J'ai économisé 6 mois de tâtonnement sur ma reorg grâce aux retours de la commu.",
    name: "Julie P.",
    initials: "JP",
    role: "Directrice Communication · ETI",
  },
  {
    quote: "On parle de vrais sujets, avec des vrais chiffres. Pas de posture.",
    name: "Marc B.",
    initials: "MB",
    role: "CMO · SaaS B2B",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="section-navy">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <span className="section-label">— Ce qu'en disent les Futuristes</span>
        <h2 className="text-3xl md:text-4xl font-grotesk font-medium mt-3 mb-10 tracking-tight text-white">
          La parole à ceux qui en sont.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-6 card-lift"
              style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
            >
              <span className="text-3xl font-serif leading-none" style={{ color: "hsl(186 60% 32%)" }}>"</span>
              <p className="text-sm leading-relaxed mt-1 mb-5 text-white/80">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "hsl(186 79% 47%)" }}>
                  <span className="font-mono text-[10px] font-medium" style={{ color: "hsl(228 56% 10%)" }}>{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-white/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
