import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const yesItems = [
  "Vous avez 7+ ans d'expérience en Marketing / Comm",
  "Vous êtes CMO, VP, Director, Head of, ou senior manager",
  "Vous préférez les conversations franches aux discours corporate",
  "Vous voulez donner autant que recevoir",
];

const noItems = [
  "Vous cherchez des \"hacks\" ou des raccourcis",
  "Vous voulez vendre vos services à la communauté",
  "Vous débutez dans le métier",
];

const RevealItem = ({
  children,
  delay,
  variant,
}: {
  children: React.ReactNode;
  delay: number;
  variant: "yes" | "no";
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const Icon = variant === "yes" ? Check : X;
  const iconColor = variant === "yes" ? "text-primary" : "";
  const textColor = variant === "yes" ? "hsl(228 56% 10%)" : "hsl(228 15% 45%)";

  return (
    <li
      ref={ref}
      className="flex items-start gap-3 transition-all duration-700 ease-out"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        filter: shown ? "blur(0px)" : "blur(8px)",
      }}
    >
      <Icon
        size={18}
        className={`mt-0.5 flex-shrink-0 ${iconColor}`}
        style={variant === "no" ? { color: "hsl(228 15% 70%)" } : undefined}
      />
      <span
        className={`text-base ${variant === "yes" ? "font-medium" : ""} leading-snug`}
        style={{ color: textColor }}
      >
        {children}
      </span>
    </li>
  );
};

export const ForYouSection = () => {
  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ background: "hsl(186 60% 32%)" }} />
          <span className="section-label">Pour qui</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10" style={{ color: "hsl(228 56% 10%)" }}>
          C'est pour vous si...
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="bg-white rounded-xl p-8" style={{ border: "1px solid hsl(228 10% 85%)" }}>
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5 block text-primary">— Oui</span>
            <ul className="space-y-4">
              {yesItems.map((item, i) => (
                <RevealItem key={item} delay={i * 110} variant="yes">{item}</RevealItem>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8" style={{ border: "1px solid hsl(228 10% 85%)" }}>
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5 block" style={{ color: "hsl(228 15% 60%)" }}>— Non</span>
            <ul className="space-y-4">
              {noItems.map((item, i) => (
                <RevealItem key={item} delay={i * 110} variant="no">{item}</RevealItem>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
