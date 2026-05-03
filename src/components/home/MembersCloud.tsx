/**
 * Members cloud — placeholder avatars grid.
 * Will be connected to admin/database later for real member photos.
 */

const placeholderMembers = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  initials: ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST", "UV", "WX"][i % 12],
}));

export const MembersCloud = () => {
  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ background: "hsl(186 60% 32%)" }} />
          <span className="section-label">La communauté</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-3" style={{ color: "hsl(228 56% 10%)" }}>
          Ils sont déjà{" "}
          <span className="font-serif-accent" style={{ color: "hsl(186 60% 32%)" }}>Futuristes.</span>
        </h2>
        <p className="text-base max-w-xl mb-10 leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>
          850+ leaders Marketing / Comm qui échangent chaque jour.
        </p>

        <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
          {placeholderMembers.map((m) => (
            <div
              key={m.id}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors duration-300"
              style={{
                border: "1px solid hsl(228 10% 80%)",
                background: "white",
                color: "hsl(228 15% 55%)",
              }}
            >
              {m.initials}
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-6 font-mono uppercase tracking-wider" style={{ color: "hsl(228 15% 65%)" }}>
          Photos bientôt connectées depuis l'espace admin
        </p>
      </div>
    </section>
  );
};
