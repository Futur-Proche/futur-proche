const formats = [
  {
    tag: "01_Entraide",
    title: "Questions et réponses quotidiennes",
    desc: "Quel CRM choisir ? Comment structurer une équipe de 3 ? Comment défendre son budget en ComEx ? Qui connaît une bonne agence PR verticalisée ? Qui a vu passer une offre d'emploi pour un retailer international ? Les réponses viennent de gens qui se sont déjà posés la même question ; et qui ont déjà choisi avant vous.",
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
  <section className="bg-background">
    <div className="container mx-auto px-6 py-24 md:py-32">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Les formats</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-grotesk font-medium tracking-tight mb-12">
        Ce qui se passe chez{" "}
        <span className="font-serif-accent">futur proche.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {formats.map((f) => (
          <div key={f.tag} className="card-glass p-7 hover:border-primary/40 transition-colors">
            <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">{f.tag}</span>
            <h3 className="text-xl font-grotesk font-medium mt-3 mb-3 text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
