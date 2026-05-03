const formats = [
  {
    tag: "01_WhatsApp",
    title: "Échanges quotidiens",
    desc: "Questions, recos, débats. Réponses en heures, pas en jours.",
  },
  {
    tag: "02_Events",
    title: "After Proche",
    desc: "Speakers triés sur le volet. Networking entre pairs. Paris, Lyon, Bordeaux et plus.",
  },
  {
    tag: "03_Podcast",
    title: "Conversations sans filtre",
    desc: "Avec ceux qui font, pas avec ceux qui théorisent. Des convictions forgées sur le terrain.",
  },
  {
    tag: "04_Jobs",
    title: "Opportunités",
    desc: "Recrutement et missions partagés entre membres. Le bouche-à-oreille de pros seniors.",
  },
];

export const FormatsSection = () => {
  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ background: "hsl(186 60% 32%)" }} />
          <span className="section-label">Une commu, plusieurs formats</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-3" style={{ color: "hsl(228 56% 10%)" }}>
          Ce qui se passe à l'intérieur.
        </h2>
        <p className="text-base max-w-2xl mb-10 leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>
          Quatre canaux complémentaires pour des Futuristes connectés au quotidien et aux moments forts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formats.map((f) => (
            <div
              key={f.tag}
              className="bg-white rounded-xl p-6 flex flex-col card-lift"
              style={{ border: "1px solid hsl(228 10% 85%)" }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(186 60% 32%)" }}>{f.tag}</span>
              <h3 className="text-lg font-grotesk font-semibold mt-3 mb-2" style={{ color: "hsl(228 56% 10%)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
