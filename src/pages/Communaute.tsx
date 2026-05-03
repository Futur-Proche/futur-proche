import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClipboardList, Eye, Rocket, MessageSquare, Mic, Briefcase, BarChart3 } from "lucide-react";

/* ───────────── DATA ───────────── */

const sujets = [
  "Comment mieux positionner mon Marketing auprès de mon ComEx ?",
  "Quel outil de recommandation pour mon site ?",
  "Comment gérer un retard de paiement sur une mission freelance ?",
  "Quelle agence PR pour parler de Tech en France ?",
  "Comment redéfinir les rôles dans mon équipe ?",
  "Quel CRM choisir pour un CAC40 vs une startup série B ?",
];

const formats = [
  {
    icon: MessageSquare,
    tag: "01",
    title: "After Proche & dîners",
    body: "Des afterworks et dîners chaque mois, des speakers haut niveau pour explorer nos problématiques clé ensemble. Paris, Lyon, Bordeaux, Toulouse, Nantes, Lille — et ça se développe. Chaque After Proche explore un sujet stratégique du métier : internationalisation, social media, IA et micro-équipes, community marketing, creator economy, Marketing & ComEx / CoDir etc. Échanges et débats concrets entre pairs, pas de la keynote descendante.",
  },
  {
    icon: Mic,
    tag: "02",
    title: "Le podcast futur proche",
    body: "1 h de talk show mensuel pour challenger les a priori, entre leaders Marketing / Comm. 3 invités, 1 problématique terrain, le tout animé par Dominique Trémouille, CMO Part Time & cofounder futur proche. Un élément clé : pas de recettes toutes faites, des convictions forgées au quotidien.",
  },
  {
    icon: Briefcase,
    tag: "03",
    title: "Jobs, missions et recommandations",
    body: "Recrutements, missions freelance, recommandations de prestataires et d'outils. Quand un Futuriste cherche un profil ou un partenaire, sa réponse, il la trouve chez futur proche. Le bouche-à-oreille de 850+ leaders qui se font confiance.",
  },
  {
    icon: BarChart3,
    tag: "04",
    title: "Études et analyse terrain",
    body: "Étude de rémunération annuelle (800+ répondants en 2025), synthèses mensuelles des échanges, analyses terrain. Des données quali & quanti exclusives, produites par et pour les membres.",
  },
];

const stats = [
  { label: "Expérience minimum", value: "7 à 8 ans en Marketing / Communication, salarié comme indépendant" },
  { label: "C-Level", value: "40 % — CMO, VP Marketing, Directeurs" },
  { label: "Répartition", value: "35 % PME et ETI, 25 % startups et scale-ups, 20 % grands groupes, 20 % indépendants et agences" },
  { label: "Secteurs", value: "B2B, B2C, Tech, Retail, Services, Industrie, Food, Pharma…" },
];

const steps = [
  {
    icon: ClipboardList,
    tag: "01",
    title: "Candidature",
    desc: "Un formulaire rapide (2 minutes). Parcours, poste actuel, motivation.",
  },
  {
    icon: Eye,
    tag: "02",
    title: "Review",
    desc: "L'équipe Onboarding examine chaque profil : expérience (7+ ans), poste en cours et passés, personnalité & expériences diverses.",
  },
  {
    icon: Rocket,
    tag: "03",
    title: "Intégration",
    desc: "Accès à la communauté WhatsApp, séquence d'onboarding, présentation aux membres, invitation aux prochains événements, ressources et opportunités.",
  },
];

/* ───────────── COMPONENT ───────────── */

const Communaute = () => (
  <>
    <Navbar />
    <main>
      {/* ── SECTION 1 — Hero ── */}
      <section className="section-navy relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <span className="section-label mb-4 inline-block">— La communauté</span>
          <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.15] mb-6">
            850+ leaders Marketing et Comm.{" "}
            <span className="font-serif-accent text-primary">
              Une seule communauté
            </span>{" "}
            pour trancher sur les sujets qui comptent.
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl mx-auto">
            futur proche rassemble les leaders du Marketing et de la Communication les plus engagés de France. Pas un annuaire, pas un réseau de plus. L'endroit où 800 pairs seniors se posent les vraies questions — et y répondent.
          </p>
        </div>
      </section>

      {/* ── SECTION 2 — Le quotidien ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— Le quotidien chez futur proche</span>
          <h2
            className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight"
            style={{ color: "hsl(228 56% 10%)" }}
          >
            Ce qui se passe chaque semaine
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-8 rounded-full" />

          <p
            className="text-base md:text-lg leading-relaxed max-w-3xl mb-10"
            style={{ color: "hsl(228 15% 35%)" }}
          >
            La communauté vit sur WhatsApp, tous les jours, toute l'année. Des centaines de messages par semaine. Des Futuristes qui partagent leurs arbitrages en cours, leurs doutes, leurs trouvailles, leurs idées. Des réponses concrètes, sourcées, sans détour.
          </p>

          {/* Sujets réels */}
          <h3
            className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5"
            style={{ color: "hsl(186 60% 32%)" }}
          >
            Exemples de sujets réels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {sujets.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 card-lift"
                style={{ border: "1px solid hsl(228 10% 85%)" }}
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-[1.2px] block mb-2"
                  style={{ color: "hsl(186 60% 32%)" }}
                >
                  #{String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{ color: "hsl(228 56% 10%)" }}
                >
                  {s}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: "hsl(228 15% 45%)" }}>
            Pas des discussions théoriques, des décisions qui se prennent, en live. Des réponses de pros qui ont déjà été confrontés au même choix, aux mêmes freins.
          </p>
        </div>
      </section>

      {/* ── SECTION 3 — Les formats ── */}
      <section className="section-navy relative">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">Les formats</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
            Une commu, plusieurs formats.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formats.map((f) => (
              <div
                key={f.tag}
                className="rounded-xl p-7 flex flex-col card-lift"
                style={{
                  background: "hsl(228 40% 14%)",
                  border: "1px solid hsl(228 30% 22%)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "hsl(186 79% 47% / 0.12)" }}
                  >
                    <f.icon size={20} className="text-primary" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-grotesk font-semibold mb-3 text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — Qui sont les Futuristes ? ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— Qui sont les Futuristes ?</span>
          <h2
            className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight"
            style={{ color: "hsl(228 56% 10%)" }}
          >
            Le profil des membres
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-8 rounded-full" />

          <p
            className="text-base md:text-lg leading-relaxed max-w-3xl mb-10"
            style={{ color: "hsl(228 15% 35%)" }}
          >
            Pas de profil type unique. Le Marketing est riche et diversifié, futur proche est un miroir de ça. Ce qui rassemble les Futuristes, c'est le niveau d'expérience en Marketing / Comm et l'envie de la mettre au service des autres.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl p-6"
                style={{ border: "1px solid hsl(228 10% 85%)" }}
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-[1.5px] block mb-2"
                  style={{ color: "hsl(186 60% 32%)" }}
                >
                  {s.label}
                </span>
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{ color: "hsl(228 56% 10%)" }}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Ce qui les rassemble */}
          <div
            className="rounded-xl p-7 md:p-10"
            style={{ background: "hsl(228 56% 10%)" }}
          >
            <h3 className="text-lg font-grotesk font-semibold text-white mb-3">
              Ce qui les rassemble
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-white/70 max-w-3xl">
              La conviction que le Marketing est un métier de terrain, pas de théorie. Et que les meilleures décisions se prennent quand on peut les confronter à des pairs qui comprennent le contexte, qui sont déjà passés par là.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — Comment devenir Futuriste ── */}
      <section className="section-navy relative">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">Rejoindre</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
            Comment devenir{" "}
            <span className="font-serif-accent text-primary">Futuriste</span> ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {steps.map((s) => (
              <div
                key={s.tag}
                className="rounded-xl p-7 flex flex-col card-lift"
                style={{
                  background: "hsl(228 40% 14%)",
                  border: "1px solid hsl(228 30% 22%)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "hsl(186 79% 47% / 0.12)" }}
                  >
                    <s.icon size={20} className="text-primary" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-lg font-grotesk font-semibold mb-2 text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{s.desc}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-7 md:p-10"
            style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
          >
            <h3 className="text-lg font-grotesk font-semibold text-white mb-3">
              Pourquoi un process de sélection ?
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-white/70 max-w-3xl">
              Parce que la valeur de futur proche repose sur la qualité de chaque membre. On ne cherche pas à grossir sans boussole, on cherche à s'assurer que la communauté gagne en valeur à chaque nouveau Futuriste onboardé.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — CTA ── */}
      <section className="relative overflow-hidden gradient-mesh-bg">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white mb-8">
            Candidature en 2 minutes.{" "}
            <span className="font-serif-accent text-primary">Réponse sous 48 h.</span>
          </h2>
          <Link
            to="/candidater"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-grotesk font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{
              background: "hsl(186 79% 47%)",
              color: "hsl(228 56% 10%)",
            }}
          >
            Devenir Futuriste →
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Communaute;
