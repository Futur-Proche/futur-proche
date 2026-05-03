import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { value: 850, suffix: "+", label: "FUTURISTES" },
  { value: 7, suffix: "+", label: "ANNÉES_XP_MIN" },
  { value: 40, suffix: "%", label: "C_LEVEL" },
  { value: 15, suffix: "+", label: "AFTER_PROCHE" },
];

const StatItem = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { value: animated, ref } = useCountUp(value);
  return (
    <div className="flex flex-col gap-2">
      <span ref={ref} className="text-5xl md:text-6xl font-grotesk font-bold leading-none" style={{ color: "hsl(228 56% 10%)" }}>
        {animated}<span className="text-3xl md:text-4xl align-top text-primary">{suffix}</span>
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[1.5px]" style={{ color: "hsl(228 15% 50%)" }}>{label}</span>
    </div>
  );
};

export const KeyElementsSection = () => {
  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="section-label">Les chiffres qui comptent</span>
        </div>

        <p className="text-base max-w-2xl mb-12 leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>
          B2B, B2C, startups, grands groupes, indépendants — tous secteurs réunis autour d'un même niveau d'exigence.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
};
