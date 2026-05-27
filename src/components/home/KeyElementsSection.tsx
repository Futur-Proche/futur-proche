import { useCountUp } from "@/hooks/useCountUp";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";
import speakerEvent from "@/assets/speaker-event.jpg";
import eventCommunity from "@/assets/event-community.jpg";
import dinerCommunaute from "@/assets/diner-communaute.jpg";

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
    image: speakerEvent,
  },
  {
    tag: "02",
    title: "Direction Communication",
    desc: "Dircom, Head of Brand, Comm Corporate — au croisement image et stratégie.",
    image: eventCommunity,
  },
  {
    tag: "03",
    title: "Founders & C-Level",
    desc: "Fondateurs et dirigeants qui portent eux-mêmes la marque.",
    image: dinerCommunaute,
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
    className="group relative overflow-hidden aspect-[3/4] cursor-default transition-all duration-500 ease-out"
    style={{
      background: "hsl(228 56% 10%)",
      border: "1px solid hsl(228 30% 22%)",
      transitionDelay: `${idx * 140}ms`,
    }}
  >
    {/* Background image */}
    <img
      src={p.image}
      alt=""
      aria-hidden
      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-[900ms] ease-out"
    />

    {/* Dark gradient overlay for readability */}
    <div
      className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
      style={{
        background:
          "linear-gradient(180deg, hsl(228 56% 10% / 0.35) 0%, hsl(228 56% 10% / 0.75) 55%, hsl(228 56% 10% / 0.95) 100%)",
      }}
    />

    {/* clip-path mask reveal at mount */}
    <div
      className="absolute inset-0 bg-[hsl(228_56%_10%)] transition-all duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)] z-20 pointer-events-none"
      style={{
        clipPath: active ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transitionDelay: `${idx * 140}ms`,
      }}
    />

    {/* hover cyan tint */}
    <div className="absolute inset-0 bg-[hsl(186_79%_47%/0.12)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    {/* vertical cyan bar — appears on hover */}
    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-out z-10" />

    {/* dot grid texture */}
    <div className="absolute inset-0 opacity-20 dot-grid pointer-events-none" />


    {/* big number watermark */}
    <span
      className="absolute -bottom-10 -right-4 font-grotesk font-bold text-white/[0.07] group-hover:text-white/[0.12] leading-none select-none transition-colors duration-500"
      style={{ fontSize: "16rem" }}
    >
      {p.tag}
    </span>

    {/* Content */}
    <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-10">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">
          {p.tag}
        </span>
        {/* cyan line that stretches at reveal */}
        <div className="h-px bg-white/10 mt-3 mb-6 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-[900ms] ease-out"
            style={{
              width: active ? "100%" : "0%",
              transitionDelay: `${idx * 140 + 400}ms`,
            }}
          />
        </div>
        <h3 className="text-2xl md:text-3xl font-grotesk font-semibold text-white tracking-tight">
          {p.title}
        </h3>
      </div>

      {/* description — hidden by default, revealed on hover (desktop) / always on mobile */}
      <div className="flex items-end justify-between gap-4">
        <p
          className="text-sm text-white/65 leading-relaxed max-w-[85%] transition-all duration-500 ease-out md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
        >
          {p.desc}
        </p>
        <span
          className="font-grotesk text-2xl text-primary shrink-0 transition-all duration-500 md:opacity-0 md:translate-x-[-6px] md:group-hover:opacity-100 md:group-hover:translate-x-0"
          aria-hidden
        >
          →
        </span>
      </div>
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

        {/* Demarcation + Profils types — style Hydra */}
        <div className="mt-24 md:mt-32">
          <div className="h-px w-full bg-white/10 mb-16 md:mb-20" />
        </div>

        <div ref={profilsReveal.ref}>
          <span className="font-mono text-xs uppercase tracking-[1.8px] text-primary mb-3 block">
            — Trois profils, une même exigence
          </span>
          <p
            className="font-serif italic text-xl md:text-2xl text-white/80 mb-12 max-w-2xl leading-snug"
          >
            À qui s'adresse vraiment Futur Proche.
          </p>
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
