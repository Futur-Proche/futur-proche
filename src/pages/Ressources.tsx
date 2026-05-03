import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Mic,
  BarChart3,
  FileText,
  Mail,
  Headphones,
  Play,
  Users,
  ExternalLink,
  Lock,
} from "lucide-react";

/* ───────── COMPONENT ───────── */

const Ressources = () => (
  <>
    <Navbar />
    <main>
      {/* ── S1 — Hero ── */}
      <section className="section-navy relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <span className="section-label mb-4 inline-block">— Ressources &amp; Contenus</span>
          <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.15] mb-6">
            Ce qui émerge quand 850+ leaders Marketing / Comm échangent{" "}
            <span className="font-serif-accent text-primary">sans filtre.</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl mx-auto">
            Podcast, études terrain, synthèses des échanges — les contenus futur proche naissent des conversations de la communauté. Pas d'une rédaction.
          </p>
        </div>
      </section>

      {/* ── S2 — Le Podcast ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— Le podcast</span>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
            Le podcast futur proche
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-8 rounded-full" />

          <p className="text-base md:text-lg leading-relaxed max-w-3xl mb-10" style={{ color: "hsl(228 15% 35%)" }}>
            Des conversations longues avec les leaders qui font le Marketing et la Communication au quotidien. Deux formats en alternance :
          </p>

          {/* Formats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-7 card-lift" style={{ border: "1px solid hsl(228 10% 85%)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                  <Mic size={20} style={{ color: "hsl(186 60% 32%)" }} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(186 60% 32%)" }}>Format 1</span>
              </div>
              <h3 className="text-lg font-grotesk font-semibold mb-2" style={{ color: "hsl(228 56% 10%)" }}>Le Talk</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 45%)" }}>
                Le format signature. Deux à trois leaders Marketing / Comm débattent d'un sujet stratégique du métier, durant 1 h+. On ne cherche pas le consensus, on confronte les approches, les méthodes, les convictions — et on montre que plusieurs chemins existent, qu'il faut sans cesse se réadapter.
              </p>
            </div>

            <div className="bg-white rounded-xl p-7 card-lift" style={{ border: "1px solid hsl(228 10% 85%)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                  <Users size={20} style={{ color: "hsl(186 60% 32%)" }} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(186 60% 32%)" }}>Format 2</span>
              </div>
              <h3 className="text-lg font-grotesk font-semibold mb-2" style={{ color: "hsl(228 56% 10%)" }}>Marketing × Autres métiers</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 45%)" }}>
                Le marketing ne vit pas en vase clos. Dans ce format, on invite des leaders Marketing / Comm à échanger avec des profils issus d'autres disciplines — Sales, Finance, Produit, DG. L'objectif : confronter la valeur du marketing à ceux qui la questionnent, la financent ou la subissent. C'est là que les meilleures prises de conscience se produisent.
              </p>
            </div>
          </div>

          {/* Chiffres + liens */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Headphones size={18} style={{ color: "hsl(186 60% 32%)" }} />
              <span className="font-grotesk font-semibold" style={{ color: "hsl(228 56% 10%)" }}>20 épisodes</span>
              <span className="text-sm" style={{ color: "hsl(228 15% 50%)" }}>· 4 500+ écoutes</span>
            </div>
          </div>

          <p className="text-sm mb-4" style={{ color: "hsl(228 15% 45%)" }}>
            Accès public, épisodes complets en vidéo et en audio.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Spotify", href: "#" },
              { label: "Apple Podcasts", href: "#" },
              { label: "YouTube", href: "#" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-grotesk font-medium transition-opacity hover:opacity-80"
                style={{ background: "hsl(228 56% 10%)", color: "white" }}
              >
                <Play size={14} /> {l.label} <ExternalLink size={12} className="opacity-40" />
              </a>
            ))}
          </div>

          {/* Placeholder: embed player / carrousel */}
          <div className="mt-10 rounded-xl p-10 flex items-center justify-center" style={{ background: "hsl(228 10% 88%)" }}>
            <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "hsl(228 15% 55%)" }}>
              Embed player / carrousel des 3 derniers épisodes — à intégrer
            </p>
          </div>
        </div>
      </section>

      {/* ── S3 — Études terrain ── */}
      <section className="section-navy relative">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">Études terrain</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-4 text-white">
            Les données qui viennent du terrain
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-8 rounded-full" />

          <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl mb-10">
            Chaque semestre, futur proche produit une étude à partir de sondages menés auprès des membres. Pas de panels externes, pas uniquement une analyse de données statistiques — les réponses viennent de leaders Marketing / Comm qui vivent les sujets au quotidien.
          </p>

          {/* Étude phare */}
          <div className="rounded-xl p-7 md:p-10 mb-8" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                <BarChart3 size={20} className="text-primary" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Étude phare</span>
            </div>
            <h3 className="text-xl font-grotesk font-bold text-white mb-3">
              Rémunération Marketing &amp; Communication
            </h3>
            <ul className="space-y-2 text-sm text-white/60 leading-relaxed mb-4">
              <li>800+ répondants en 2025, 1 000+ consultations en full organique</li>
              <li>Grilles de salaires par séniorité, secteur et taille d'entreprise</li>
              <li>Les données les plus complètes du marché français sur la rémunération des leaders Marketing / Comm</li>
            </ul>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.2px] text-white/40">
              <Lock size={12} /> Réservé aux Futuristes
            </span>
          </div>

          {/* Sujets à venir */}
          <h3 className="font-mono text-[11px] uppercase tracking-[1.5px] text-primary mb-5">
            Sujets à venir
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "Pratiques et outils : ce que les leaders Marketing / Comm utilisent vraiment",
              "IA et organisation : comment les équipes s'adaptent",
              "Freelance vs CDI : les arbitrages de carrière",
            ].map((s) => (
              <div key={s} className="rounded-xl p-5" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <p className="text-sm leading-relaxed text-white/60">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S4 — Synthèses mensuelles ── */}
      <section className="section-cream">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
          <span className="section-label">— Synthèses mensuelles</span>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
            Ce qu'on observe chaque mois
          </h2>
          <div className="w-16 h-[3px] bg-primary mb-8 rounded-full" />

          <p className="text-base md:text-lg leading-relaxed max-w-3xl mb-6" style={{ color: "hsl(228 15% 35%)" }}>
            Tous les mois, l'équipe futur proche compile et analyse les échanges de la communauté. Les 2-3 sujets majeurs du mois, les tendances qui émergent, les approches qui reviennent, les données quand elles existent.
          </p>
          <p className="text-base leading-relaxed max-w-3xl mb-6" style={{ color: "hsl(228 15% 35%)" }}>
            Ce n'est pas un édito, c'est le regard collectif de 850+ leaders Marketing / Comm sur ce qui les occupe à l'instant T.
          </p>

          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.2px]" style={{ color: "hsl(228 15% 55%)" }}>
            <Lock size={12} /> Réservé aux Futuristes
          </span>
        </div>
      </section>

      {/* ── S5 — Newsletter ── */}
      <section className="section-navy relative">
        <div className="dot-grid" />
        <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="section-label">Newsletter</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
            La newsletter futur proche
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-xl p-7" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                  <Mail size={20} className="text-primary" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Pour les Futuristes</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                Chaque semaine, un condensé de ce qui se passe dans l'écosystème. Les sujets du moment, les événements à venir, les contenus qui sortent, les opportunités partagées par les membres. Le fil d'info interne de la communauté.
              </p>
            </div>

            <div className="rounded-xl p-7" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                  <FileText size={20} className="text-primary" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Pour tous</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                Si vous n'êtes pas Futuriste, vous pouvez quand même nous suivre : les temps forts de futur proche vus de l'extérieur — les événements marquants, les épisodes de podcast, les études publiées, les grandes tendances observées dans la communauté.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="#newsletter"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-grotesk font-semibold text-base transition-all duration-300 hover:scale-105"
              style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
            >
              S'inscrire à la newsletter →
            </a>
          </div>
        </div>
      </section>

      {/* ── S6 — CTA ── */}
      <section className="relative overflow-hidden gradient-mesh-bg">
        <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white mb-3">
            Les meilleurs contenus naissent des meilleures{" "}
            <span className="font-serif-accent text-primary">conversations.</span>
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Rejoignez les 850+ Futuristes pour accéder à l'ensemble des ressources.
          </p>
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

export default Ressources;
