import { useState, useEffect, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  Camera,
  ArrowRight,
} from "lucide-react";

import speakerEventImg from "@/assets/speaker-event.jpg";
import speakerEventPublicImg from "@/assets/speaker-event-public.jpg";
import dinerCommunauteImg from "@/assets/diner-communaute.jpg";
import femmesCommunauteImg from "@/assets/femmes-communaute.jpg";
import networkingEchangesImg from "@/assets/networking-echanges.jpg";
import ambianceGroupeImg from "@/assets/ambiance-groupe.jpg";
import terrasseGroupeImg from "@/assets/terrasse-groupe.jpg";
import conferencePublicImg from "@/assets/conference-public-nombreux.jpg";
import selfieFpImg from "@/assets/selfie-fp.jpg";
import networkingEchanges3Img from "@/assets/networking-echanges-3.jpg";

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

const formatDate = (d: string) => {
  const date = new Date(d + "T00:00:00");
  const months = ["Jan.", "Fév.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

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

const carouselImages = [
  { src: femmesCommunauteImg, alt: "Les Futuristes — networking entre membres" },
  { src: networkingEchangesImg, alt: "Échanges et rencontres entre pairs" },
  { src: ambianceGroupeImg, alt: "Selfie de groupe — ambiance Futuristes" },
  { src: terrasseGroupeImg, alt: "Terrasse parisienne avec vue" },
  { src: conferencePublicImg, alt: "Conférence — public nombreux" },
  { src: selfieFpImg, alt: "L'équipe futur proche" },
];

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

  const { data: pastEventsData } = useQuery({
    queryKey: ["past-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("statut", "past")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  /* Carousel state */
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = carouselImages.length;

  const next = useCallback(() => setCurrentSlide((p) => (p + 1) % totalSlides), [totalSlides]);
  const prev = useCallback(() => setCurrentSlide((p) => (p - 1 + totalSlides) % totalSlides), [totalSlides]);

  useEffect(() => {
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next]);

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              <div>
                <p className="text-base md:text-lg leading-relaxed mb-10" style={{ color: "hsl(228 15% 35%)" }}>
                  Le format récurrent de futur proche. Tous les mois ou presque, dans une ville de France, futur proche rassemble des leaders Marketing / Comm autour d'un sujet stratégique du métier.
                </p>

                <h3 className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5" style={{ color: "hsl(186 60% 32%)" }}>
                  Le format
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formatDetails.map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-[10px] font-bold" style={{ background: "hsl(186 79% 47% / 0.12)", color: "hsl(186 60% 32%)" }}>
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 30%)" }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos After Proche */}
              <div className="grid grid-cols-2 gap-3">
                <img
                  src={speakerEventImg}
                  alt="Speakers en discussion lors d'un After Proche chez Brevo"
                  className="rounded-xl object-cover w-full h-full col-span-2"
                  style={{ maxHeight: 280 }}
                />
                <img
                  src={speakerEventPublicImg}
                  alt="Le public d'un After Proche"
                  className="rounded-xl object-cover w-full h-48"
                />
                <div
                  className="rounded-xl flex items-center justify-center p-6"
                  style={{ background: "hsl(228 56% 10%)" }}
                >
                  <p className="text-center font-grotesk font-semibold text-white text-sm leading-snug">
                    <span className="text-primary text-2xl font-bold block mb-1">35+</span>
                    After Proche organisés depuis 2023
                  </p>
                </div>
              </div>
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
              <div className="rounded-xl overflow-hidden card-lift" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <img
                  src={dinerCommunauteImg}
                  alt="Dîner entre Futuristes"
                  className="w-full h-48 object-cover"
                />
                <div className="p-7">
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
              </div>

              <div className="rounded-xl overflow-hidden card-lift" style={{ border: "1px solid hsl(228 30% 22%)" }}>
                <img
                  src={networkingEchanges3Img}
                  alt="Networking entre leaders Marketing lors d'un événement futur proche"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-7">
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
          </div>
        </section>

        {/* ── SECTION 4 — Prochains rendez-vous (from DB) ── */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
            <span className="section-label">— Bientôt près de chez vous · Inscriptions ouvertes</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-3 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
              Nos prochains rendez-vous
            </h2>
            <p className="text-sm md:text-base mb-10 max-w-2xl" style={{ color: "hsl(228 15% 45%)" }}>
              Les dates à venir, à réserver dès maintenant.
            </p>

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
                        <div className="flex-shrink-0 flex sm:flex-col items-center justify-center gap-1 px-6 py-4 sm:py-6" style={{ background: "hsl(228 56% 10%)" }}>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-primary">{monthShort}</span>
                          <span className="text-3xl font-grotesk font-bold text-white">{day}</span>
                        </div>

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

                          <div className="flex-shrink-0">
                            <Link
                              to={`/evenements/${ev.slug ?? ev.id}`}
                              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-grotesk font-medium text-sm transition-all hover:scale-105"
                              style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
                            >
                              Voir & s'inscrire <ExternalLink size={14} />
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

        {/* ── SECTION 4.5 — Retours sur nos événements (avec photos & recap) ── */}
        {(() => {
          const pastWithContent = (pastEventsData ?? []).filter((ev) => {
            const g = ((ev as any).gallery as any[] | null) ?? [];
            const r = ((ev as any).recap as string | null) ?? "";
            return g.length > 0 || (r && r.trim().length > 0);
          });
          if (pastWithContent.length === 0) return null;
          return (
            <section className="section-cream">
              <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
                <span className="section-label">— Ils ont eu lieu</span>
                <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-3 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
                  Retours sur nos rendez-vous
                </h2>
                <p className="text-sm md:text-base mb-10 max-w-2xl" style={{ color: "hsl(228 15% 45%)" }}>
                  Photos, comptes-rendus et moments forts des derniers After Proche.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastWithContent.map((ev) => {
                    const g = (((ev as any).gallery as { url: string; alt?: string }[] | null) ?? []);
                    const r = ((ev as any).recap as string | null) ?? "";
                    return (
                      <Link
                        key={ev.id}
                        to={`/evenements/${ev.slug ?? ev.id}`}
                        className="group rounded-2xl overflow-hidden bg-white card-lift block"
                        style={{ border: "1px solid hsl(228 10% 85%)" }}
                      >
                        {g.length > 0 ? (
                          <div className="grid grid-cols-3 gap-0.5 h-44">
                            <img src={g[0].url} alt={g[0].alt ?? ev.titre} className="col-span-2 row-span-2 w-full h-full object-cover" />
                            {g[1] && <img src={g[1].url} alt={g[1].alt ?? ""} className="w-full h-full object-cover" />}
                            {g[2] ? (
                              <div className="relative w-full h-full">
                                <img src={g[2].url} alt={g[2].alt ?? ""} className="w-full h-full object-cover" />
                                {g.length > 3 && (
                                  <div className="absolute inset-0 flex items-center justify-center text-white font-grotesk font-semibold text-sm" style={{ background: "hsl(228 56% 10% / 0.65)" }}>
                                    +{g.length - 3}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-full h-full" style={{ background: "hsl(228 56% 10%)" }} />
                            )}
                          </div>
                        ) : (
                          <div className="h-32 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(228 56% 12%), hsl(248 60% 20%))" }}>
                            <Camera className="w-8 h-8 text-primary/40" />
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "hsl(186 60% 32%)" }}>
                              {formatLabels[ev.format] ?? ev.format}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "hsl(228 15% 55%)" }}>
                              {formatDate(ev.date)}{ev.ville ? ` · ${ev.ville}` : ""}
                            </span>
                          </div>
                          <h3 className="text-lg font-grotesk font-bold mb-2" style={{ color: "hsl(228 56% 10%)" }}>
                            {ev.titre}
                          </h3>
                          {r && (
                            <p className="text-sm leading-relaxed line-clamp-3 mb-3" style={{ color: "hsl(228 15% 40%)" }}>
                              {r}
                            </p>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-medium group-hover:gap-2 transition-all" style={{ color: "hsl(186 60% 32%)" }}>
                            Voir le compte-rendu <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })()}


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
              {(pastEventsData ?? []).map((ev, i) => {
                const g = (((ev as any).gallery as any[] | null) ?? []);
                const r = ((ev as any).recap as string | null) ?? "";
                const hasContent = g.length > 0 || (r && r.trim().length > 0);
                const Row = (
                  <div
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b items-center"
                    style={{ borderColor: "hsl(228 30% 22%)" }}
                  >
                    <span className="md:col-span-1 font-mono text-xs text-primary">#{(pastEventsData?.length ?? 0) - i}</span>
                    <span className="md:col-span-6 text-sm text-white/80 font-medium flex items-center gap-2">
                      {ev.titre}
                      {hasContent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-primary">
                          <Camera className="w-3 h-3" /> Compte-rendu
                        </span>
                      )}
                    </span>
                    <span className="md:col-span-3 text-sm text-white/50">{ev.ville}</span>
                    <span className="md:col-span-2 text-sm text-white/40 font-mono">{formatDate(ev.date)}</span>
                  </div>
                );
                return hasContent ? (
                  <Link key={ev.id} to={`/evenements/${ev.slug ?? ev.id}`} className="block hover:bg-white/[0.02] transition-colors">
                    {Row}
                  </Link>
                ) : (
                  <div key={ev.id}>{Row}</div>
                );
              })}
            </div>
          </div>
        </section>


        {/* ── SECTION 6 — En images (carousel) ── */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28">
            <span className="section-label">— futur proche en images</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-10 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
              Les moments qui comptent
            </h2>

            {/* Carousel */}
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselImages.map((img, i) => (
                  <div key={i} className="min-w-full">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-[320px] md:h-[480px] object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Controls */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors hover:bg-white/30"
                style={{ background: "hsl(228 56% 10% / 0.5)" }}
                aria-label="Photo précédente"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors hover:bg-white/30"
                style={{ background: "hsl(228 56% 10% / 0.5)" }}
                aria-label="Photo suivante"
              >
                <ChevronRight size={20} className="text-white" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? "bg-primary scale-110" : "bg-white/40"}`}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            </div>
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
