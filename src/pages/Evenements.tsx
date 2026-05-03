import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Calendar,
  MapPin,
  Users,
  UtensilsCrossed,
  Handshake,
  ExternalLink,
} from "lucide-react";

/* ───────── TYPES ───────── */

interface Speaker {
  prenom: string;
  nom: string;
  poste: string;
  entreprise: string;
  photo_url: string | null;
}

/* ───────── DATA ───────── */

const formatDetails = [
  "Speakers high level, experts et doers de leur sujet",
  "Tables rondes et débats — le public participe",
  "Networking en petit comité — 50 à 100 personnes max",
  "Accueil chez un partenaire, dans des espaces de qualité",
];

const themes = [
  "Faire exploser des champions français à l'international",
  "Social Media : ce qui marche encore, ce qui ne marche plus",
  "Community Marketing : construire une audience qui vous appartient",
  "IA et micro-équipes marketing : faire plus avec moins",
  "Creator Economy et Influence",
  "Le nouveau modèle des agences marketing / comm",
];

const pastEvents = [
  { num: "#10", theme: "Social Media : ce qui marche encore, ce qui ne marche plus", ville: "Paris", date: "Mars 2026" },
  { num: "#9", theme: "IA et micro-équipes marketing : faire plus avec moins", ville: "Lyon", date: "Fév. 2026" },
  { num: "#8", theme: "Community Marketing : construire une audience qui vous appartient", ville: "Paris", date: "Déc. 2025" },
  { num: "#7", theme: "Faire exploser des champions français à l'international", ville: "Paris (chez Brevo)", date: "Nov. 2025" },
];

const partners = [
  "Brevo", "Le Wagon", "Contentsquare", "Back Market", "Malt",
  "Mazars", "Labellium", "Publicis", "Agorapulse", "VivaTech",
];

const formatLabels: Record<string, string> = {
  after_proche: "After Proche",
  diner: "Dîner",
  workshop: "Workshop",
  autre: "Autre",
};

/* ───────── COMPONENT ───────── */

const Evenements = () => {
  const { data: publishedEvents } = useQuery({
    queryKey: ["published-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("statut", "published")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Navbar />
      <main>
        {/* ── SECTION 1 — Hero ── */}
        <section className="section-navy relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl text-center">
            <span className="section-label mb-4 inline-block">— Événements</span>
            <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.15] mb-6">
              Les idées ne circulent jamais mieux{" "}
              <span className="font-serif-accent text-primary">qu'autour d'un verre.</span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl mx-auto mb-10">
              Chaque mois, dans plusieurs villes françaises, les Futuristes se rassemblent pour échanger sur des sujets qui nous concernent tous et créer de vraies synergies.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <span className="text-white font-grotesk font-semibold text-lg">35+</span>
                <span className="text-white/50 text-sm">événements organisés</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <span className="text-white/50 text-sm">Paris, Bordeaux, Lyon, Nantes, Lille…</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2 — After Proche ── */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
            <span className="section-label">— Format principal</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
              After Proche
            </h2>
            <div className="w-16 h-[3px] bg-primary mb-8 rounded-full" />

            <p className="text-base md:text-lg leading-relaxed max-w-3xl mb-10" style={{ color: "hsl(228 15% 35%)" }}>
              Le format récurrent de futur proche. Tous les mois ou presque, dans une ville de France, futur proche rassemble des leaders Marketing / Comm autour d'un sujet stratégique du métier.
            </p>

            <h3 className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5" style={{ color: "hsl(186 60% 32%)" }}>
              Le format
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {formatDetails.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-[10px] font-bold" style={{ background: "hsl(186 79% 47% / 0.12)", color: "hsl(186 60% 32%)" }}>
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 30%)" }}>{d}</p>
                </div>
              ))}
            </div>

            <h3 className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5" style={{ color: "hsl(186 60% 32%)" }}>
              Thématiques passées
            </h3>
            <div className="flex flex-wrap gap-2 mb-10">
              {themes.map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-3 py-1.5 rounded-full"
                  style={{ background: "hsl(228 56% 10%)", color: "hsl(0 0% 100% / 0.7)" }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 text-sm" style={{ color: "hsl(228 15% 45%)" }}>
              <p><strong style={{ color: "hsl(228 56% 10%)" }}>Villes :</strong> Paris, Lyon, Bordeaux, Toulouse, Nantes, Lille — et ça s'étend.</p>
              <p><strong style={{ color: "hsl(228 56% 10%)" }}>Accès :</strong> Tarif par événement, inclus pour les Founders Futuristes.</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3 — Autres formats ── */}
        <section className="section-navy relative">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="section-label">Autres formats</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
              Au-delà des After Proche
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl p-7 card-lift" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                    <UtensilsCrossed size={20} className="text-primary" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Dîners</span>
                </div>
                <h3 className="text-lg font-grotesk font-semibold mb-3 text-white">Dîners futur proche</h3>
                <p className="text-sm leading-relaxed text-white/60">
                  Des dîners en petit comité (10-15 personnes), une fois par mois. Un sujet, une table, des échanges sans filtre. À Paris et partout en France.
                </p>
              </div>

              <div className="rounded-xl p-7 card-lift" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                    <Handshake size={20} className="text-primary" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-primary">Annuel</span>
                </div>
                <h3 className="text-lg font-grotesk font-semibold mb-3 text-white">The Network Effect</h3>
                <p className="text-sm leading-relaxed text-white/60">
                  futur proche invite d'autres collectifs à croiser leurs regards. Un sujet, plusieurs communautés, une soirée. Une fois par an.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4 — Prochains rendez-vous (from DB) ── */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
            <span className="section-label">— Bientôt près de chez vous</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-10 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
              Nos prochains rendez-vous
            </h2>

            <div className="space-y-5">
              {publishedEvents && publishedEvents.length > 0 ? (
                publishedEvents.map((ev) => {
                  const speakers = (ev.speakers as unknown as Speaker[] | null) ?? [];
                  const eventDate = new Date(ev.date);
                  const monthShort = eventDate.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
                  const day = eventDate.getDate();

                  return (
                    <div
                      key={ev.id}
                      className="bg-white rounded-xl overflow-hidden card-lift"
                      style={{ border: "1px solid hsl(228 10% 85%)" }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Date badge */}
                        <div className="flex-shrink-0 flex sm:flex-col items-center justify-center gap-1 px-6 py-4 sm:py-6" style={{ background: "hsl(228 56% 10%)" }}>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-primary">{monthShort}</span>
                          <span className="text-3xl font-grotesk font-bold text-white">{day}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "hsl(186 60% 32%)" }}>
                                {formatLabels[ev.format] ?? ev.format}
                              </span>
                            </div>
                            <h3 className="text-base font-grotesk font-semibold mb-2" style={{ color: "hsl(228 56% 10%)" }}>
                              {ev.titre}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-xs mb-3" style={{ color: "hsl(228 15% 50%)" }}>
                              {ev.heure && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={13} /> {ev.heure?.slice(0, 5)}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MapPin size={13} /> {ev.lieu ? `${ev.lieu}, ${ev.ville}` : ev.ville}
                              </span>
                              {ev.capacite && (
                                <span className="flex items-center gap-1">
                                  <Users size={13} /> {ev.capacite} places
                                </span>
                              )}
                            </div>

                            {/* Speaker round photos */}
                            {speakers.length > 0 && (
                              <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                  {speakers.map((s, i) => (
                                    s.photo_url ? (
                                      <img
                                        key={i}
                                        src={s.photo_url}
                                        alt={`${s.prenom} ${s.nom}`}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                                      />
                                    ) : (
                                      <div
                                        key={i}
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white"
                                        style={{ background: "hsl(228 56% 10%)", color: "hsl(0 0% 100% / 0.6)" }}
                                      >
                                        {(s.prenom?.[0] ?? "")}{(s.nom?.[0] ?? "")}
                                      </div>
                                    )
                                  ))}
                                </div>
                                <div className="text-xs" style={{ color: "hsl(228 15% 40%)" }}>
                                  {speakers.map((s) => (
                                    <span key={s.nom} className="block leading-tight">
                                      <strong>{s.prenom} {s.nom}</strong>
                                      {s.entreprise && <span className="text-[10px] text-opacity-60"> · {s.entreprise}</span>}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* CTA */}
                          <div className="flex-shrink-0">
                            <Link
                              to="/candidater"
                              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-grotesk font-medium text-sm transition-all hover:scale-105"
                              style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
                            >
                              S'inscrire <ExternalLink size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-sm py-8" style={{ color: "hsl(228 15% 55%)" }}>
                  Prochains événements à venir…
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION 5 — Événements passés ── */}
        <section className="section-navy relative">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="section-label">Historique</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
              Les événements passés
            </h2>

            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b mb-2" style={{ borderColor: "hsl(228 30% 22%)" }}>
              <span className="col-span-1 font-mono text-[10px] uppercase tracking-[1.2px] text-white/30">#</span>
              <span className="col-span-6 font-mono text-[10px] uppercase tracking-[1.2px] text-white/30">Thème</span>
              <span className="col-span-3 font-mono text-[10px] uppercase tracking-[1.2px] text-white/30">Ville</span>
              <span className="col-span-2 font-mono text-[10px] uppercase tracking-[1.2px] text-white/30">Date</span>
            </div>

            <div className="space-y-0">
              {pastEvents.map((ev) => (
                <div
                  key={ev.num}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b"
                  style={{ borderColor: "hsl(228 30% 22%)" }}
                >
                  <span className="md:col-span-1 font-mono text-xs text-primary">{ev.num}</span>
                  <span className="md:col-span-6 text-sm text-white/80 font-medium">{ev.theme}</span>
                  <span className="md:col-span-3 text-sm text-white/50">{ev.ville}</span>
                  <span className="md:col-span-2 text-sm text-white/40 font-mono">{ev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 6 — En images ── */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
            <span className="section-label">— futur proche en images</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-10 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
              Les moments qui comptent
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(228 10% 85%)" }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "hsl(228 15% 60%)" }}>
                    Photo {i + 1}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-xs mt-4 font-mono uppercase tracking-wider" style={{ color: "hsl(228 15% 65%)" }}>
              Photos à ajouter depuis l'espace admin
            </p>
          </div>
        </section>

        {/* ── SECTION 7 — Partenaires ── */}
        <section className="section-navy relative">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="section-label">Nos partenaires</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-10 text-white">
              Ils nous accueillent
            </h2>

            <div className="flex flex-wrap gap-4 justify-center">
              {partners.map((p) => (
                <div
                  key={p}
                  className="px-6 py-3 rounded-lg font-grotesk font-medium text-sm text-white/70"
                  style={{ border: "1px solid hsl(228 30% 22%)", background: "hsl(228 40% 14%)" }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 8 — CTA ── */}
        <section className="relative overflow-hidden gradient-mesh-bg">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white mb-3">
              Le prochain After Proche se fait{" "}
              <span className="font-serif-accent text-primary">avec vous.</span>
            </h2>
            <p className="text-white/50 text-sm mb-8">Événement réservé aux Futuristes</p>
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
};

export default Evenements;
