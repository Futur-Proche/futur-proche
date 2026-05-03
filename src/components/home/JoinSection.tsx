import communityImg from "@/assets/community-group.jpg";

export const JoinSection = () => {
  return (
    <section className="section-navy">
      <div className="dot-grid" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-16 md:py-20">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="section-label">Rejoindre</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-8 text-white">
          Comment devenir{" "}
          <span className="font-serif-accent text-primary">Futuriste</span> ?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-white/70">
              futur proche rassemble des leaders et responsables Marketing / Comm seniors francophones. Tous secteurs, toutes tailles.
            </p>
            <p className="text-base leading-relaxed text-white/70">
              Le critère : une expérience senior confirmée et l'envie de jouer le jeu du collectif. Chaque Futuriste contribue autant qu'il reçoit : c'est ce qui fait la qualité des échanges.
            </p>
            <p className="text-sm leading-relaxed text-white/40">
              Chaque nouveau profil est validé par l'équipe Onboarding pour garantir que la communauté gagne en valeur à chaque nouveau membre.
            </p>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-[4/3] card-lift">
            <img
              src={communityImg}
              alt="Membres de la communauté futur proche lors d'un événement"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(228 56% 10% / 0.3), transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
};
