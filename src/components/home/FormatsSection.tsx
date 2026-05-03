const formats = [
  {
    tag: "01_WhatsApp",
    title: "Échanges quotidiens",
    desc: "Questions, recos, débats. Réponses en heures, pas en jours.",
  },
  {
    tag: "02_Events",
    title: "After Proche",
    desc: "Speakers triés sur le volet. Networking sans bullshit.",
  },
  {
    tag: "03_Podcast",
    title: "Conversations cash",
    desc: "Avec ceux qui font, pas avec ceux qui théorisent.",
  },
  {
    tag: "04_Jobs",
    title: "Opportunités",
    desc: "Recrutement et missions partagés entre membres.",
  },
];

export const FormatsSection = () => (
  <section className="bg-background">
    <div className="container mx-auto px-6 py-24 md:py-32">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="section-label">Une commu, plusieurs formats</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-grotesk font-medium tracking-tight mb-3">
        Ce qui se passe à l'intérieur.
      </h2>
      <p className="text-muted-foreground text-base max-w-2xl mb-12 leading-relaxed">
        Quatre canaux complémentaires pour des Futuristes connectés au quotidien et aux moments forts.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {formats.map((f) => (
          <div key={f.tag} className="card-glass p-6 hover:border-primary/50 transition-colors group">
            <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">{f.tag}</span>
            <h3 className="text-lg font-grotesk font-medium mt-3 mb-2 text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
