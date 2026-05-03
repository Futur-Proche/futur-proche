import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/* ───────── DATA ───────── */

const timeline = [
  {
    date: "Novembre 2023",
    text: "Création du premier groupe WhatsApp. 6 cofondateurs, une trentaine de membres en quelques jours.",
  },
  {
    date: "2024",
    text: "Croissance organique. 200 membres, puis 500. Premiers After Proche à Paris. Le podcast démarre. Le bouche-à-oreille fait tout. Premiers partenaires : Mazars, Labellium, Malt etc.",
  },
  {
    date: "2025",
    text: "Expansion nationale : Lyon, Bordeaux, 700+ membres. Première étude rémunération (800+ répondants). Partenariats avec Brevo, Contentsquare, Agorapulse, Publicis, 321 Founded etc.",
  },
  {
    date: "Printemps 2026",
    text: "850+ membres, extension Toulouse, Nantes, Lille en cours. 30+ events organisés. Partenaire de VivaTech.",
  },
];

const team = [
  {
    name: "Dominique Trémouille",
    role: "CMO Part Time & co-fondateur",
    bio: "15+ ans de marketing, startups et grands groupes. Pilote la stratégie et le podcast de futur proche, anime les événements.",
  },
  {
    name: "Mathilde Avenati",
    role: "Dir. Marketing & Retail La Chambre, co-fondatrice",
    bio: "Pilote l'onboarding des membres et les opérations.",
  },
  {
    name: "Dimitri Scandaletos",
    role: "Co-fondateur",
    bio: "",
  },
  {
    name: "Laeticia Pinoteau",
    role: "Team Lead Brand & Comm EGYM Wellpass (ex Gymlib), co-fondatrice",
    bio: "",
  },
];

const convictions = [
  "Le Marketing est avant tout un métier de terrain, pas que de théorie. Les meilleures décisions se prennent en les confrontant à des pairs qui en comprennent le contexte, l'enjeu et qui nous permettent d'aller plus loin plus vite.",
  "Avancer seul(e) n'est plus une option. Le métier est trop large, il change trop rapidement, il est trop fragmenté pour qu'une seule personne maîtrise tout.",
  "La valeur d'une Communauté se mesure à la qualité de chaque membre, pas uniquement à leur nombre.",
  "La connexion en physique d'abord. Les liens les plus forts se créent en face-à-face. Le digital entretient, le physique construit.",
];

/* ───────── COMPONENT ───────── */

const APropos = () => (
  <>
    <Navbar />
    <main>
      {/* ── S1 — Hero ── */}
      <section className="section-navy relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl">
          <span className="section-label mb-4 inline-block">— À propos</span>
          <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.15] mb-6">
            futur proche est né d'un problème{" "}
            <span className="font-serif-accent text-primary">que l'on a tous.</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl">
            Le Marketing se complexifie mais les leaders Marketing et Communication en France manquaient d'un espace dynamique et non-verticalisé pour échanger au quotidien. Des communautés existaient déjà mais elles étaient soit trop ciblées, soit pas assez modernes et dynamiques, soit trop régionales et pas nationales. Pas une formation, pas un réseau transactionnel, pas un énième webinar : futur proche c'est un endroit où poser les vraies questions et se forger de nouvelles convictions et compétences, entre pairs. Fin 2023, six pros du marketing ont décidé de le créer.
          </p>
        </div>
      </section>

      {/* ── S2 — Chronologie ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— La chronologie</span>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
            De 0 à 800 en deux ans, en full reco &amp; organique
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-10 rounded-full" />

          {/* Timeline */}
          <div className="relative pl-8 border-l-2 space-y-10" style={{ borderColor: "hsl(186 79% 47% / 0.3)" }}>
            {timeline.map((t) => (
              <div key={t.date} className="relative">
                <div
                  className="absolute -left-[calc(2rem+5px)] top-1 w-3 h-3 rounded-full"
                  style={{ background: "hsl(186 79% 47%)" }}
                />
                <span className="font-mono text-[11px] uppercase tracking-[1.2px] block mb-2" style={{ color: "hsl(186 60% 32%)" }}>
                  {t.date}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 30%)" }}>
                  {t.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm leading-relaxed max-w-3xl" style={{ color: "hsl(228 15% 45%)" }}>
            Chaque Futuriste nous a rejoint par conviction ou par recommandation, c'est ce qui fait la force de la Communauté. On ne cherche pas à grandir de manière aveugle, mais en préservant la qualité globale des membres rassemblés.
          </p>
        </div>
      </section>

      {/* ── S3 — L'équipe ── */}
      <section className="section-navy relative">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">L'équipe</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
            Ceux qui font tourner futur proche
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div
                key={m.name}
                className="rounded-xl p-6 flex flex-col card-lift"
                style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
              >
                {/* Photo placeholder */}
                <div
                  className="w-16 h-16 rounded-full mb-4 flex items-center justify-center font-mono text-sm font-bold"
                  style={{ background: "hsl(186 79% 47% / 0.15)", color: "hsl(186 60% 32%)" }}
                >
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="text-base font-grotesk font-semibold text-white mb-1">{m.name}</h3>
                <p className="text-xs text-primary font-mono uppercase tracking-wider mb-3">{m.role}</p>
                {m.bio && <p className="text-sm leading-relaxed text-white/50">{m.bio}</p>}
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-6 font-mono uppercase tracking-wider text-white/30">
            Photos à ajouter depuis l'espace admin
          </p>
        </div>
      </section>

      {/* ── S4 — Convictions ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— Ce à quoi on croit</span>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-10 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
            Nos convictions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {convictions.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-7 card-lift"
                style={{ border: "1px solid hsl(228 10% 85%)" }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[1.2px] block mb-3" style={{ color: "hsl(186 60% 32%)" }}>
                  #{String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 30%)" }}>{c}</p>
              </div>
            ))}
          </div>

          {/* Photo placeholders */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-lg flex items-center justify-center"
                style={{ background: "hsl(228 10% 85%)" }}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "hsl(228 15% 60%)" }}>
                  Photo {i + 1}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4 font-mono uppercase tracking-wider" style={{ color: "hsl(228 15% 65%)" }}>
            Photos events à ajouter
          </p>
        </div>
      </section>

      {/* ── S5 — CTA ── */}
      <section className="relative overflow-hidden gradient-mesh-bg">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white mb-8">
            L'histoire continue{" "}
            <span className="font-serif-accent text-primary">avec vous.</span>
          </h2>
          <Link
            to="/candidater"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-grotesk font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
          >
            Devenir Futuriste →
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default APropos;
