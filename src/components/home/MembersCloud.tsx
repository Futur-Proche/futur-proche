/**
 * Members cloud — placeholder avatars grid.
 * Will be connected to admin/database later for real member photos.
 */

import { useScrollReveal } from "@/hooks/useScrollReveal";

const placeholderMembers = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  initials: ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST", "UV", "WX"][i % 12],
}));

export const MembersCloud = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-navy">
      <div className="dot-grid" />
      <div className="orb orb--blue w-[300px] h-[300px] bottom-[10%] left-[10%]" />

      <div ref={ref} className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="section-label">La communauté</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-3 text-white">
          Ils sont déjà{" "}
          <span className="font-serif-accent text-primary">Futuristes.</span>
        </h2>
        <p className="text-base max-w-xl mb-10 leading-relaxed text-white/50">
          850+ leaders Marketing / Comm qui échangent chaque jour.
        </p>

        <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
          {placeholderMembers.map((m) => (
            <div
              key={m.id}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-mono font-medium border border-white/10 bg-secondary/60 text-white/40 hover:border-primary/40 hover:text-primary/60 transition-colors duration-300"
            >
              {m.initials}
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-6 font-mono uppercase tracking-wider text-white/30">
          Photos bientôt connectées depuis l'espace admin
        </p>
      </div>
    </section>
  );
};
