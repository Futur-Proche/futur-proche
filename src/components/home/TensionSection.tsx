import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Wallet, Clock, User, LayoutGrid, BarChart3, Network } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Pain = {
  num: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

const painPoints: Pain[] = [
  {
    num: "01",
    title: "Un budget à défendre seul.",
    text: "Personne autour de vous pour challenger vos arbitrages. Le ComEx attend des résultats, pas des explications.",
    icon: Wallet,
  },
  {
    num: "02",
    title: "Des décisions qui n'attendent pas.",
    text: "Changer de CRM, lancer un canal, couper un budget — pas le temps d'un appel d'offres ou d'un cabinet.",
    icon: Clock,
  },
  {
    num: "03",
    title: "L'isolement du leader Marketing.",
    text: "Un doute sur un outil, un prestataire, une stratégie. Aucune réponse de quelqu'un qui a vécu la même chose.",
    icon: User,
  },
  {
    num: "04",
    title: "Des prestataires qui se ressemblent tous.",
    text: "Mêmes slides, mêmes promesses. Difficile de séparer le bruit du signal sans retour direct de pairs.",
    icon: LayoutGrid,
  },
  {
    num: "05",
    title: "Des KPIs qu'on ne peut pas comparer.",
    text: "Vos benchmarks viennent de rapports génériques. Aucune base sectorielle réelle pour vous situer honnêtement.",
    icon: BarChart3,
  },
  {
    num: "06",
    title: "Une carrière qu'on construit en silence.",
    text: "Les bonnes opportunités circulent en off. Sans réseau de pairs au même niveau, vous passez à côté.",
    icon: Network,
  },
];

export const TensionSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setActiveIdx(painPoints.length - 1);
      return;
    }

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      if (window.innerWidth < 768) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const eased = Math.min(progress / 0.92, 1);
      const i = Math.min(
        painPoints.length - 1,
        Math.floor(eased * painPoints.length)
      );
      setActiveIdx(i);
      setScrollLocked(rect.top <= 0 && rect.bottom >= window.innerHeight);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const target =
      window.scrollY +
      rect.top +
      ((i + 0.5) / painPoints.length) * scrollable;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const active = painPoints[activeIdx];
  const ActiveIcon = active.icon;

  return (
    <section
      ref={sectionRef}
      id="tension"
      className="relative bg-cream text-navy md:min-h-[260vh]"
    >
      {/* DESKTOP : sticky stage */}
      <div className="hidden md:block md:sticky md:top-0 md:h-screen overflow-hidden">
        {/* subtle dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(228 56% 10%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center relative">
          {/* header */}
          <div className="text-center mb-10 lg:mb-14">
            <span className="section-label mb-3 inline-block">— Le constat</span>
            <h2 className="font-grotesk text-4xl lg:text-5xl font-medium tracking-tight leading-[1.05] mt-2">
              Vous connaissez{" "}
              <em className="font-serif italic font-normal">sûrement ça.</em>
            </h2>
            <p className="mt-4 text-sm text-navy/60 max-w-xl mx-auto">
              Six tensions que vivent chaque semaine les leaders Marketing / Comm.
            </p>
          </div>

          {/* active card */}
          <div className="max-w-3xl mx-auto w-full px-4">
            <article
              key={active.num}
              className="relative"
              style={{
                animation: "tensionIn 600ms cubic-bezier(0.2,0.7,0.2,1) both",
              }}
            >
              <div className="flex items-start gap-6">
                <div
                  className="shrink-0 w-16 h-16 rounded-xl flex items-center justify-center border"
                  style={{
                    background: "hsl(186 79% 47% / 0.08)",
                    borderColor: "hsl(186 79% 47% / 0.3)",
                  }}
                >
                  <ActiveIcon size={28} strokeWidth={1.6} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-xs text-navy/50 tracking-[2px]">
                      {active.num}
                      <span className="text-navy/25"> / 06</span>
                    </span>
                    <span
                      className="h-px flex-1 bg-primary origin-left"
                      style={{
                        animation: "tensionLine 700ms ease-out 120ms both",
                      }}
                    />
                  </div>
                  <h3 className="font-grotesk text-2xl lg:text-3xl font-semibold leading-tight tracking-tight">
                    {active.title}
                  </h3>
                  <p className="mt-3 text-base lg:text-lg text-navy/70 leading-relaxed max-w-2xl">
                    {active.text}
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* progress rail (right side) */}
          <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {painPoints.map((p, i) => {
              const isActive = i === activeIdx;
              const isPast = i < activeIdx;
              return (
                <button
                  key={p.num}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`Tension ${p.num} — ${p.title}`}
                  className="group flex items-center gap-3 cursor-pointer"
                >
                  <span
                    className="font-mono text-[10px] tracking-[1.5px] transition-opacity"
                    style={{
                      opacity: isActive ? 1 : 0,
                      color: "hsl(228 56% 10%)",
                    }}
                  >
                    {p.num}
                  </span>
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 28 : 8,
                      height: 8,
                      background: isActive
                        ? "hsl(186 79% 47%)"
                        : isPast
                          ? "hsl(228 56% 10% / 0.5)"
                          : "hsl(228 56% 10% / 0.15)",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* scroll hint */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-6 font-mono text-[10px] uppercase tracking-[2px] text-navy/40 transition-opacity"
            style={{ opacity: scrollLocked && activeIdx < painPoints.length - 1 ? 1 : 0 }}
          >
            Scrollez pour révéler ↓
          </div>
        </div>
      </div>

      {/* MOBILE : liste verticale */}
      <div className="md:hidden container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-block">— Le constat</span>
          <h2 className="font-grotesk text-3xl font-medium tracking-tight leading-tight mt-3">
            Vous connaissez{" "}
            <em className="font-serif italic font-normal">sûrement ça.</em>
          </h2>
        </div>
        <div className="space-y-4">
          {painPoints.map((p, i) => {
            const Icon = p.icon;
            return (
              <article
                key={p.num}
                className="relative pl-5 pr-4 py-5 rounded-lg bg-white/60 border-l-2 border-primary"
                style={{
                  animation: `fadeInUp 500ms ease-out ${i * 80}ms both`,
                  border: "1px solid hsl(228 10% 85%)",
                  borderLeft: "3px solid hsl(186 79% 47%)",
                  background:
                    i % 2 === 0 ? "hsl(0 0% 100% / 0.6)" : "hsl(40 33% 96%)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center"
                    style={{
                      background: "hsl(186 79% 47% / 0.1)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.7} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="font-mono text-[10px] text-navy/50 tracking-[1.5px]">
                      {p.num}
                    </span>
                    <h3 className="mt-1 font-grotesk text-base font-semibold leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-navy/70 leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/candidater"
            className="inline-flex items-center gap-2 bg-navy text-cream px-6 py-3 rounded-full font-grotesk text-sm font-medium hover:bg-navy/90 transition-colors"
          >
            Devenir Futuriste →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes tensionIn {
          0% { opacity: 0; transform: translateY(14px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes tensionLine {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default TensionSection;
