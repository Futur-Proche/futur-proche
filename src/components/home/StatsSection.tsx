const stats = [
  { value: "700", suffix: "+", label: "Futuristes" },
  { value: "7", suffix: "+", label: "Années_XP_Min" },
  { value: "40", suffix: "%", label: "C_Level" },
  { value: "15", suffix: "+", label: "After_Proche" },
];

export const StatsSection = () => (
  <section className="bg-background border-t border-border">
    <div className="container mx-auto px-6 py-20">
      <div className="flex items-center gap-2 mb-10">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Les chiffres qui comptent</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-5xl md:text-6xl font-grotesk font-bold text-foreground">
              {s.value}
              <span className="text-primary text-3xl md:text-4xl">{s.suffix}</span>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[1.2px] text-muted-foreground mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
