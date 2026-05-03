const elements = [
  { value: "850+", label: "Futuristes de tous horizons" },
  { value: "40%", label: "de C-Levels" },
  { value: "30+", label: "événements physiques organisés en France" },
  { value: "∞", label: "De pros seniors dans votre poche" },
  { value: "✓", label: "Un réseau de partenaires de haut niveau" },
  { value: "⊕", label: "Tous secteurs : B2B, B2C, startups, grands groupes, indépendants" },
];

export const KeyElementsSection = () => (
  <section className="bg-background border-t border-border">
    <div className="container mx-auto px-6 py-20 md:py-28">
      <div className="flex items-center gap-2 mb-10">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Les chiffres qui comptent</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {elements.map((el) => (
          <div key={el.label} className="flex items-start gap-4">
            <span className="text-2xl md:text-3xl font-grotesk font-bold text-primary flex-shrink-0 min-w-[70px]">
              {el.value}
            </span>
            <p className="text-base text-foreground leading-snug pt-1">{el.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
