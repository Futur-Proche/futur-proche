const formats = [
  {
    tag: "01_Entraide",
    title: "Questions et réponses quotidiennes",
    desc: "Quel CRM choisir ? Comment structurer une équipe de 3 ? Comment défendre son budget en ComEx ? Les réponses viennent de gens qui se sont déjà posés la même question ; et qui ont déjà choisi avant vous.",
  },
  {
    tag: "02_Events",
    title: "After Proche",
    desc: "Events mensuels, speakers high level, tables rondes, networking. Paris, Lyon, Bordeaux, Toulouse, Nantes, Lille, Marseille — le réseau s'étend. Des formats récurrents, toute l'année.",
  },
  {
    tag: "03_Podcast",
    title: "Le podcast",
    desc: "Des conversations longues avec des leaders Marketing / Comm. Pas de recettes toutes faites, des convictions forgées sur le terrain.",
  },
  {
    tag: "04_Jobs",
    title: "Jobs, missions, recos",
    desc: "Recrutements, missions freelance, recommandations de prestataires. Le bouche-à-oreille de pros seniors qui se font confiance.",
  },
];

export const FormatsSection = () => (
  <section className="section-cream">
    <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full" style={{ background: "hsl(186 60% 32%)" }} />
        <span className="section-label">Les formats</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-grotesk font-medium tracking-tight mb-3">
        Ce qui se passe chez{" "}
        <span className="font-serif-accent">futur proche.</span>
      </h2>
      <p className="text-cream-muted text-base max-w-2xl mb-10 leading-relaxed">
        Quatre canaux complémentaires pour des Futuristes connectés au quotidien et aux moments forts.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {formats.map((f) => (
          <div key={f.tag} className="card-cream bg-white border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: "hsl(228 10% 85%)" }}>
            <span className="font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(186 60% 32%)" }}>{f.tag}</span>
            <h3 className="text-lg font-grotesk font-medium mt-2 mb-2" style={{ color: "hsl(228 56% 10%)" }}>{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 45%)" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
