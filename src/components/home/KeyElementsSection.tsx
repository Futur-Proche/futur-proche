const stats = [
  { value: "850", suffix: "+", label: "FUTURISTES" },
  { value: "7", suffix: "+", label: "ANNÉES_XP_MIN" },
  { value: "40", suffix: "%", label: "C_LEVEL" },
  { value: "15", suffix: "+", label: "AFTER_PROCHE" },
];

export const KeyElementsSection = () => (
  <section className="section-navy border-t border-border">
    <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="flex items-center gap-2 mb-12">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Les chiffres qui comptent</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2">
            <span className="text-5xl md:text-6xl font-grotesk font-bold text-white leading-none">
              {s.value}<span className="text-primary text-3xl md:text-4xl align-top">{s.suffix}</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-white/40">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
