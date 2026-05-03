const elements = [
  { value: "850+", label: "Futuristes de tous horizons" },
  { value: "40%", label: "de C-Levels" },
  { value: "30+", label: "événements physiques organisés en France" },
  { value: "∞", label: "De pros seniors dans votre poche" },
  { value: "✓", label: "Un réseau de partenaires de haut niveau" },
  { value: "⊕", label: "B2B, B2C, startups, grands groupes, indépendants" },
];

export const KeyElementsSection = () => (
  <section className="section-navy border-t border-border">
    <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="flex items-center gap-2 mb-10">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Les chiffres qui comptent</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {elements.map((el) => (
          <div key={el.label} className="flex flex-col gap-1">
            <span className="text-3xl md:text-4xl font-grotesk font-bold text-primary">
              {el.value}
            </span>
            <p className="text-sm text-muted-foreground leading-snug">{el.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
