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

export const TestimonialsSection = () => (
  <section className="mode-lecture">
    <div className="container mx-auto px-6 py-24 md:py-32">
      <span className="section-label">— Ce qu'en disent les Futuristes</span>
      <h2 className="text-3xl md:text-4xl font-grotesk font-medium mt-4 mb-12 tracking-tight text-foreground">
        La parole à ceux qui en sont.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-card border border-border rounded-lg p-7">
            <span className="text-primary text-4xl font-serif leading-none">"</span>
            <p className="text-base text-foreground leading-relaxed mt-2 mb-6">{t.quote}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-mono text-[11px] font-medium text-primary-foreground">{t.initials}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
