import { useCountUp } from "@/hooks/useCountUp";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";

const stats = [
  { value: 850, suffix: "+", label: "FUTURISTES", sub: "B2B • B2C • Startups", fill: 0.92 },
  { value: 7, suffix: "+", label: "ANNÉES_XP_MIN", sub: "Seniors confirmés", fill: 0.55 },
  { value: 40, suffix: "%", label: "C_LEVEL", sub: "CMO • VP • Head of", fill: 0.4 },
  { value: 15, suffix: "+", label: "AFTER_PROCHE", sub: "Paris • Lyon • Bordeaux", fill: 0.75 },
];

const profils = [
  {
    tag: "01",
    title: "Direction Marketing",
    desc: "CMO, VP Marketing, Head of Growth — qui pilotent budgets et équipes.",
  },
  {
    tag: "02",
    title: "Direction Communication",
    desc: "Dircom, Head of Brand, Comm Corporate — au croisement image et stratégie.",
  },
  {
    tag: "03",
    title: "Founders & C-Level",
    desc: "Fondateurs et dirigeants qui portent eux-mêmes la marque.",
  },
];

const StatCell = ({
  stat,
  active,
  index,
}: {
  stat: typeof stats[number];
  active: boolean;
  index: number;
}) => {
  const { value: animated, ref } = useCountUp(stat.value);
  return (
    <div
      className="relative p-8 md:p-12 transition-all duration-700 ease-out"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-white/40">
          {stat.label}
        </span>
        <span className="font-mono text-[10px] text-white/30">0{index + 1}</span>
      </div>

      <div ref={ref as React.RefObject<HTMLDivElement>} className="flex items-end gap-1 mb-6">
        <span className="text-6xl md:text-8xl font-grotesk font-bold text-white leading-[0.85] tabular-nums">
          {animated}
        </span>
        <span className="text-3xl md:text-5xl font-grotesk font-bold text-primary leading-none pb-1">
          {stat.suffix}
        </span>
      </div>

      {/* progress bar */}
      <div className="h-px w-full bg-white/10 mb-3 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-[1600ms] ease-out"
          style={{ width: active ? `${stat.fill * 100}%` : "0%", transitionDelay: `${index * 120 + 200}ms` }}
        />
      </div>

      <span className="font-mono text-[11px] tracking-[1px] text-white/60">{stat.sub}</span>
    </div>
  );
};

const ProfilCol = ({
  p,
  idx,
  active,
}: {
  p: typeof profils[number];
  idx: number;
  active: boolean;
}) => (
  <div
    className="group relative overflow-hidden transition-all duration-500 ease-out hover:scale-[1.02]"
    style={{
      transitionDelay: `${idx * 140}ms`,
    }}
  >
    {/* Visual top block */}
    <div
      className="relative aspect-[4/5] overflow-hidden mb-6"
      style={{
        background:
          idx % 2 === 0
            ? "linear-gradient(135deg, hsl(186 79% 47% / 0.18), hsl(228 40% 14%))"
            : "linear-gradient(135deg, hsl(228 40% 14%), hsl(186 79% 47% / 0.12))",
        border: "1px solid hsl(228 30% 22%)",
      }}
    >
      {/* clip-path mask reveal */}
      <div
        className="absolute inset-0 bg-[hsl(228_56%_10%)] transition-all duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)]"
        style={{
          clipPath: active ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
          transitionDelay: `${idx * 140}ms`,
        }}
      />
      {/* big number watermark */}
      <span
        className="absolute -bottom-6 -right-2 font-grotesk font-bold text-white/10 leading-none select-none"
        style={{ fontSize: "12rem" }}
      >
        {p.tag}
      </span>
      {/* dot grid texture */}
      <div className="absolute inset-0 opacity-30 dot-grid" />
    </div>

    {/* line that stretches */}
    <div className="h-px bg-white/10 mb-5 overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-[900ms] ease-out"
        style={{
          width: active ? "100%" : "0%",
          transitionDelay: `${idx * 140 + 400}ms`,
        }}
      />
    </div>

    <div
      className="transition-all duration-700 ease-out"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${idx * 140 + 250}ms`,
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">{p.tag}</span>
      <h3 className="text-xl md:text-2xl font-grotesk font-semibold text-white mt-3 mb-2 tracking-tight">
        {p.title}
      </h3>
      <p className="text-sm text-white/55 leading-relaxed">{p.desc}</p>
    </div>
  </div>
);

export const KeyElementsSection = () => {
  const statsReveal = useStaggeredReveal<HTMLDivElement>(stats.length, 0, 0.25);
  const profilsReveal = useStaggeredReveal<HTMLDivElement>(profils.length, 0, 0.25);

  return (
    <section className="section-navy relative">
      <div className="dot-grid" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="section-label">Les chiffres qui comptent</span>
        </div>

        <p className="text-white/50 text-base max-w-2xl mb-12 leading-relaxed">
          B2B, B2C, startups, grands groupes, indépendants — tous secteurs réunis autour d'un même niveau d'exigence.
        </p>

        {/* 2x2 cadran grid */}
        <div
          ref={statsReveal.ref}
          className="grid grid-cols-1 md:grid-cols-2 border-t border-l"
          style={{ borderColor: "hsl(0 0% 100% / 0.1)" }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="border-r border-b"
              style={{ borderColor: "hsl(0 0% 100% / 0.1)" }}
            >
              <StatCell stat={s} active={statsReveal.revealed[i]} index={i} />
            </div>
          ))}
        </div>

        {/* Profils types — style Hydra */}
        <div ref={profilsReveal.ref} className="mt-24 md:mt-32">
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-white/40 mb-10 block">
            — Trois profils, une même exigence
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {profils.map((p, i) => (
              <ProfilCol key={p.tag} p={p} idx={i} active={profilsReveal.revealed[i]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
