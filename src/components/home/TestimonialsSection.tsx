import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";

const testimonials = [
  {
    quote: "Enfin un endroit où poser mes vraies questions sans passer pour un junior.",
    name: "Camille L.",
    initials: "CL",
    role: "VP Marketing · Scale-up B2B",
  },
  {
    quote: "En 6 mois, j'ai pris de meilleures décisions qu'en 2 ans seul.",
    name: "Thomas R.",
    initials: "TR",
    role: "CMO · E-commerce",
  },
  {
    quote: "Un groupe WhatsApp plus utile que 3 cabinets de conseil.",
    name: "Sarah M.",
    initials: "SM",
    role: "Head of Marketing · SaaS",
  },
  {
    quote: "Le réseau que j'aurais aimé avoir dès le début de ma carrière de directrice.",
    name: "Julie D.",
    initials: "JD",
    role: "Directrice Marketing · Retail",
  },
  {
    quote: "Ici on partage les vrais budgets, les vrais résultats. Zéro filtre.",
    name: "Antoine P.",
    initials: "AP",
    role: "Directrice Communication · ETI",
  },
  {
    quote: "On parle de vrais sujets, avec des vrais chiffres. Pas de posture.",
    name: "Marc B.",
    initials: "MB",
    role: "CMO · SaaS B2B",
  },
];

// deterministic "cloud" offsets per card
const offsets = [
  { x: -16, y: 28, r: -1.2 },
  { x: 14, y: 36, r: 0.8 },
  { x: -10, y: 24, r: -0.6 },
  { x: 18, y: 40, r: 1 },
  { x: -14, y: 30, r: -0.9 },
  { x: 12, y: 26, r: 0.6 },
];

export const TestimonialsSection = () => {
  const { ref, revealed } = useStaggeredReveal<HTMLDivElement>(testimonials.length, 90, 0.15);

  return (
    <section className="section-navy relative">
      <div className="dot-grid" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
        <span className="section-label">— Ce qu'en disent les Futuristes</span>
        <h2 className="text-3xl md:text-4xl font-grotesk font-medium mt-3 mb-12 tracking-tight text-white">
          La parole à ceux qui en sont.
        </h2>

        <div ref={ref} className="columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {testimonials.map((t, i) => {
            const on = revealed[i];
            const o = offsets[i % offsets.length];
            const finalRotate = o.r;
            return (
              <div
                key={t.name}
                className="mb-5 break-inside-avoid rounded-xl p-6 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-primary/40"
                style={{
                  background: "hsl(228 40% 14%)",
                  border: "1px solid hsl(228 30% 22%)",
                  opacity: on ? 1 : 0,
                  transform: on
                    ? `translate(0,0) scale(1) rotate(${finalRotate}deg)`
                    : `translate(${o.x}px, ${o.y}px) scale(0.92) rotate(${o.r * 2}deg)`,
                }}
              >
                <span className="text-3xl font-serif leading-none" style={{ color: "hsl(186 60% 32%)" }}>
                  "
                </span>
                <p className="text-sm leading-relaxed mt-1 mb-5 text-white/80">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "hsl(186 79% 47%)" }}
                  >
                    <span
                      className="font-mono text-[10px] font-medium"
                      style={{ color: "hsl(228 56% 10%)" }}
                    >
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
