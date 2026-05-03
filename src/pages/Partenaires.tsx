import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  MapPin,
  FileText,
  CalendarRange,
  XCircle,
  MessageCircle,
  ClipboardList,
  Rocket,
} from "lucide-react";

/* ───────── DATA ───────── */

const audience = [
  { label: "~40 % C-Level", detail: "CMO, VP Marketing, Directeurs Marketing & Communication" },
  { label: "~35 % Head of et Senior Managers", detail: "" },
  { label: "~25 % Indépendants seniors et consultants", detail: "" },
];

const ecosystemStats = [
  { value: "850+", label: "membres sur WhatsApp — plus de 100 pré-inscriptions / mois" },
  { value: "30+", label: "événements physiques — 1 500+ participants cumulés" },
  { value: "20", label: "épisodes de podcast — 4 500+ écoutes" },
  { value: "800+", label: "abonnés newsletter — 60 % de taux d'ouverture (marché B2B : ~22 %)" },
  { value: "40k", label: "vues ultra qualifiées / an — LinkedIn + site web" },
];

const collabCards = [
  {
    icon: MapPin,
    tag: "01",
    title: "Accueillir un After Proche",
    body: "Co-hoster un événement dans vos locaux. 50 à 80 leaders réunis autour d'un sujet stratégique du métier. Votre marque associée au débat, pas à un pitch. Prise de parole possible, format orienté échange, débat et valeur pour les participants. Visibilité LinkedIn, newsletter et page événement + follow-up.",
  },
  {
    icon: FileText,
    tag: "02",
    title: "Co-créer une étude ou un contenu",
    body: "Étude ou contenu co-brandés sur une problématique clé pour futur proche et pour vous. Épisode podcast, synthèse thématique : du fond, produit avec la communauté — pas un publi-rédactionnel.",
  },
  {
    icon: CalendarRange,
    tag: "03",
    title: "Partenariat annuel",
    body: "Présence récurrente dans l'écosystème fp : events, contenus, visibilité continue sur le site, la newsletter et LinkedIn. Pour les marques qui veulent s'ancrer durablement auprès des leaders Marketing / Comm français. Chaque partenariat se construit sur-mesure.",
  },
];

const dontList = [
  "On ne spamme jamais la communauté avec vos offres.",
  "On ne vend pas de données.",
  "On n'accepte pas de partenariat qui ne sert pas les membres.",
  "On ne fait pas de placement de logo sans valeur pour les Futuristes.",
  "Les prises de parole partenaires apportent du fond, pas que du business (même s'il compte évidemment).",
];

const partners = [
  "Brevo", "Agorapulse", "Malt", "Contentsquare", "Publicis",
  "Mazars", "Labellium", "Weglot", "Le Wagon", "Back Market",
];

const processSteps = [
  { icon: MessageCircle, tag: "01", title: "Échange", desc: "On discute de vos objectifs, de ce qui fait sens pour la communauté." },
  { icon: ClipboardList, tag: "02", title: "Proposition", desc: "Création d'une offre adaptée avec format et calendrier spécifique." },
  { icon: Rocket, tag: "03", title: "Activation", desc: "On co-construit le partenariat. De l'idée à l'exécution, ensemble." },
];

/* ───────── COMPONENT ───────── */

const Partenaires = () => (
  <>
    <Navbar />
    <main>
      {/* ── S1 — Hero ── */}
      <section className="section-navy relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <span className="section-label mb-4 inline-block">— Partenaires</span>
          <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.15] mb-6">
            850+ leaders Marketing / Comm français.{" "}
            <span className="font-serif-accent text-primary">Il ne manque que vous.</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl mx-auto mb-10">
            futur proche rassemble les leaders Marketing et Communication les plus actifs de France. Nos partenaires ne viennent pas acheter de la visibilité : ils s'associent à un écosystème où les discussions se passent et des décisions se prennent, au quotidien.
          </p>
          <a
            href="mailto:futurprocheparis@gmail.com?subject=Demande%20Media%20Kit"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-grotesk font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
          >
            Recevoir le Media Kit →
          </a>
        </div>
      </section>

      {/* ── S2 — Pourquoi soutenir ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— Pourquoi soutenir une communauté</span>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
            Une audience scroll, la Communauté{" "}
            <span className="font-serif-accent" style={{ color: "hsl(186 60% 32%)" }}>choisit vraiment.</span>
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-8 rounded-full" />
          <p className="text-base md:text-lg leading-relaxed max-w-3xl" style={{ color: "hsl(228 15% 35%)" }}>
            Les 850+ Futuristes ne sont pas là pour juste consommer du contenu. Ils échangent chaque jour sur leurs vrais choix : quel outil adopter, quel prestataire sélectionner, quelle agence recommander, quel budget défendre, quelle stratégie arbitrer. Être partenaire de futur proche, c'est être présent au moment où ces choix se font. Pas avant, pas après — pendant.
          </p>
        </div>
      </section>

      {/* ── S3 — Qui vous allez toucher ── */}
      <section className="section-navy relative">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">Qui vous allez toucher</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
            Les Futuristes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {audience.map((a) => (
              <div key={a.label} className="rounded-xl p-6" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <span className="text-2xl font-grotesk font-bold text-primary block mb-1">{a.label}</span>
                {a.detail && <p className="text-sm text-white/60">{a.detail}</p>}
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm text-white/60 leading-relaxed max-w-3xl">
            <p><strong className="text-white/80">Tous secteurs :</strong> SaaS, Retail, Services, Industrie, Tech, Finance, Santé, FMCG, B2B, B2C</p>
            <p><strong className="text-white/80">Expérience :</strong> De 7 à 20+ ans</p>
            <p className="text-white/80 font-medium pt-2">
              Ces 800 personnes décident ou influencent directement les budgets marketing / comm, le choix des outils, des agences et des prestataires en France.
            </p>
          </div>
        </div>
      </section>

      {/* ── S4 — L'écosystème ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— L'écosystème futur proche</span>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
            Un écosystème, pas un canal de promotion.
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-10 rounded-full" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {ecosystemStats.map((s) => (
              <div key={s.value} className="bg-white rounded-xl p-6" style={{ border: "1px solid hsl(228 10% 85%)" }}>
                <span className="text-3xl font-grotesk font-bold block mb-1" style={{ color: "hsl(228 56% 10%)" }}>{s.value}</span>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 45%)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: "hsl(228 15% 45%)" }}>
            Chaque format renforce les autres. Vos partenariats vivent sur l'ensemble de l'écosystème, pas sur un seul canal isolé.
          </p>
        </div>
      </section>

      {/* ── S5 — 3 façons de collaborer ── */}
      <section className="section-navy relative">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">Comment travailler ensemble</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
            3 façons de collaborer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collabCards.map((c) => (
              <div key={c.tag} className="rounded-xl p-7 flex flex-col card-lift" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                    <c.icon size={20} className="text-primary" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">{c.tag}</span>
                </div>
                <h3 className="text-lg font-grotesk font-semibold mb-3 text-white">{c.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S6 — Ce que l'on ne fait pas ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— Nos engagements</span>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
            Ce que l'on ne fait pas chez fp
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-8 rounded-full" />

          <div className="space-y-4 mb-8 max-w-3xl">
            {dontList.map((d) => (
              <div key={d} className="flex items-start gap-3">
                <XCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(0 60% 55%)" }} />
                <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 30%)" }}>{d}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-7 md:p-10" style={{ background: "hsl(228 56% 10%)" }}>
            <p className="text-sm md:text-base leading-relaxed text-white/70 max-w-3xl font-serif italic">
              Si votre première question c'est "combien de leads ?", c'est que ce n'est pas pour futur proche.
            </p>
          </div>
        </div>
      </section>

      {/* ── S7 — Ils nous font confiance ── */}
      <section className="section-navy relative">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">Ils nous font déjà confiance</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
            Nos partenaires
          </h2>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {partners.map((p) => (
              <div key={p} className="px-6 py-3 rounded-lg font-grotesk font-medium text-sm text-white/70" style={{ border: "1px solid hsl(228 30% 22%)", background: "hsl(228 40% 14%)" }}>
                {p}
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-mono uppercase tracking-wider text-white/30">
            Logos à remplacer depuis l'espace admin
          </p>
        </div>
      </section>

      {/* ── S8 — Le process ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— Le process</span>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-10 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
            Comment ça se passe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((s) => (
              <div key={s.tag} className="bg-white rounded-xl p-7 flex flex-col card-lift" style={{ border: "1px solid hsl(228 10% 85%)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                    <s.icon size={20} style={{ color: "hsl(186 60% 32%)" }} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(186 60% 32%)" }}>{s.tag}</span>
                </div>
                <h3 className="text-lg font-grotesk font-semibold mb-2" style={{ color: "hsl(228 56% 10%)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 45%)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S9 — CTA ── */}
      <section className="relative overflow-hidden gradient-mesh-bg">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white mb-4">
            Parlons de ce qu'on peut construire{" "}
            <span className="font-serif-accent text-primary">ensemble.</span>
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Dominique Trémouille &amp; Mathilde Avenati — futurprocheparis@gmail.com
          </p>
          <a
            href="mailto:futurprocheparis@gmail.com?subject=Demande%20Media%20Kit"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-grotesk font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
          >
            Recevoir le Media Kit →
          </a>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Partenaires;
