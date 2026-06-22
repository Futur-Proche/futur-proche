import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventsPhotoCarousel } from "@/components/shared/EventsPhotoCarousel";
import { Calendar, MapPin, Users, ExternalLink, ArrowRight, Search } from "lucide-react";
import { EventCountBadge } from "@/components/event/EventCountBadge";
import { Seo } from "@/components/Seo";

interface Speaker {
  prenom: string;
  nom: string;
  poste: string;
  entreprise: string;
  photo_url: string | null;
}

const formatLabels: Record<string, string> = {
  after_proche: "After Proche",
  diner: "Dîner",
  workshop: "Workshop",
  autre: "Événement",
};

const partners = [
  "Brevo", "Le Wagon", "Contentsquare", "Back Market", "Malt",
  "Mazars", "Labellium", "Publicis", "Agorapulse", "VivaTech",
];

const Evenements = () => {
  const today = new Date().toISOString().slice(0, 10);

  const { data: allEvents } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .in("statut", ["published", "past"])
        .order("date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [search, setSearch] = useState("");
  const [villeFilter, setVilleFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

  const villes = useMemo(
    () => Array.from(new Set((allEvents ?? []).map((e) => e.ville).filter(Boolean))).sort() as string[],
    [allEvents]
  );

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return (allEvents ?? []).filter((ev) => {
      const matchSearch = !term || `${ev.titre} ${ev.lieu ?? ""} ${ev.ville ?? ""}`.toLowerCase().includes(term);
      const matchVille = villeFilter === "all" || ev.ville === villeFilter;
      const matchFormat = formatFilter === "all" || ev.format === formatFilter;
      return matchSearch && matchVille && matchFormat;
    });
  }, [allEvents, search, villeFilter, formatFilter]);

  const upcoming = filtered.filter((ev) => ev.statut === "published" && ev.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = filtered.filter((ev) => ev.statut === "past" || ev.date < today).sort((a, b) => b.date.localeCompare(a.date));

  const renderEventCard = (ev: any, isPast: boolean) => {
    const speakers = (ev.speakers as Speaker[] | null) ?? [];
    const eventDate = new Date(ev.date + "T00:00:00");
    const monthShort = eventDate.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase().replace(".", "");
    const day = eventDate.getDate();
    const year = eventDate.getFullYear();

    return (
      <div
        key={ev.id}
        className="bg-white rounded-xl overflow-hidden card-lift"
        style={{ border: "1px solid hsl(228 10% 85%)", opacity: isPast ? 0.92 : 1 }}
      >
        <div className="flex flex-col sm:flex-row">
          <div
            className={`flex-shrink-0 flex sm:flex-col items-center justify-center gap-1 px-6 py-4 sm:py-6 sm:min-w-[100px] ${isPast ? "grayscale" : ""}`}
            style={{ background: "hsl(228 56% 10%)" }}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary">{monthShort}</span>
            <span className="text-3xl font-grotesk font-bold text-white">{day}</span>
            <span className="text-[10px] font-mono text-white/40">{year}</span>
          </div>

          {ev.image_url && (
            <div className="hidden md:block flex-shrink-0 w-48">
              <img src={ev.image_url} alt={ev.titre} className={`w-full h-full object-cover ${isPast ? "grayscale" : ""}`} loading="lazy" />
            </div>
          )}

          <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "hsl(186 60% 32%)" }}>
                  {formatLabels[ev.format] ?? ev.format}
                </span>
                {isPast && (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "hsl(228 15% 88%)", color: "hsl(228 15% 35%)" }}>
                    Passé
                  </span>
                )}
              </div>
              <h3 className="text-base md:text-lg font-grotesk font-semibold mb-2" style={{ color: "hsl(228 56% 10%)" }}>
                {ev.titre}
              </h3>
              <div className="flex flex-wrap gap-4 text-xs mb-3" style={{ color: "hsl(228 15% 50%)" }}>
                {ev.heure && !isPast && (
                  <span className="flex items-center gap-1"><Calendar size={13} /> {ev.heure?.slice(0, 5)}</span>
                )}
                <span className="flex items-center gap-1"><MapPin size={13} /> {ev.lieu ? `${ev.lieu}, ${ev.ville}` : ev.ville}</span>
                <EventCountBadge eventId={ev.id} capacite={ev.capacite} className="text-xs" />
              </div>

              {speakers.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {speakers.slice(0, 4).map((s, i) => (
                      s.photo_url ? (
                        <img key={i} src={s.photo_url} alt={`${s.prenom} ${s.nom}`} className="w-9 h-9 rounded-full object-cover ring-2 ring-white" />
                      ) : (
                        <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white" style={{ background: "hsl(228 56% 10%)", color: "hsl(0 0% 100% / 0.6)" }}>
                          {(s.prenom?.[0] ?? "")}{(s.nom?.[0] ?? "")}
                        </div>
                      )
                    ))}
                  </div>
                  <div className="text-xs" style={{ color: "hsl(228 15% 40%)" }}>
                    {speakers.slice(0, 2).map((s) => `${s.prenom} ${s.nom}`).join(", ")}
                    {speakers.length > 2 && ` +${speakers.length - 2}`}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              <Link
                to={`/evenements/${ev.slug ?? ev.id}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-grotesk font-medium text-sm transition-all hover:scale-105"
                style={
                  isPast
                    ? { background: "hsl(228 56% 10%)", color: "white" }
                    : { background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }
                }
              >
                {isPast ? "Voir le résumé" : "Voir & s'inscrire"} {isPast ? <ArrowRight size={14} /> : <ExternalLink size={14} />}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Seo title={"Événements Marketing / Comm — futur proche"} description={"After Proche, dîners, workshops : les événements physiques de la communauté futur proche pour les leaders Marketing & Comm."} path={"/evenements"} />
      <Navbar />
      <main>
        {/* HERO */}
        <section className="section-navy relative pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl text-center">
            <span className="section-label mb-4 inline-block">— Événements</span>
            <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.15] mb-6">
              Les idées ne circulent jamais mieux{" "}
              <span className="font-serif-accent text-primary">qu'autour d'un verre.</span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl mx-auto mb-8">
              Chaque mois, dans plusieurs villes françaises, les Futuristes se rassemblent pour échanger sur des sujets stratégiques et créer de vraies synergies.
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

        {/* FILTRES + LISTE */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-16 md:py-20">
            {/* Filtres */}
            <div className="flex flex-wrap gap-3 mb-10 items-center">
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(228 15% 50%)" }} />
                <input
                  type="text"
                  placeholder="Rechercher un événement, une ville…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-grotesk bg-white outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ border: "1px solid hsl(228 10% 85%)", color: "hsl(228 56% 10%)" }}
                />
              </div>
              <select value={villeFilter} onChange={(e) => setVilleFilter(e.target.value)} className="px-3 py-2.5 rounded-lg text-sm font-grotesk bg-white outline-none" style={{ border: "1px solid hsl(228 10% 85%)", color: "hsl(228 56% 10%)" }}>
                <option value="all">Toutes villes</option>
                {villes.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <select value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)} className="px-3 py-2.5 rounded-lg text-sm font-grotesk bg-white outline-none" style={{ border: "1px solid hsl(228 10% 85%)", color: "hsl(228 56% 10%)" }}>
                <option value="all">Tous formats</option>
                {Object.entries(formatLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            {/* À VENIR */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="section-label">— À venir · Inscriptions ouvertes</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-grotesk font-bold mt-2 mb-8 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
                Nos prochains rendez-vous
              </h2>
              <div className="space-y-4">
                {upcoming.length > 0 ? (
                  upcoming.map((ev) => renderEventCard(ev, false))
                ) : (
                  <p className="text-sm py-8 italic" style={{ color: "hsl(228 15% 55%)" }}>
                    Aucun événement à venir pour ces critères. De nouvelles dates arrivent bientôt.
                  </p>
                )}
              </div>
            </div>

            {/* SÉPARATEUR */}
            <div className="flex items-center gap-4 my-12">
              <div className="flex-1 h-px" style={{ background: "hsl(228 15% 75%)" }} />
              <span className="font-mono text-[10px] uppercase tracking-[2px]" style={{ color: "hsl(228 15% 45%)" }}>Historique</span>
              <div className="flex-1 h-px" style={{ background: "hsl(228 15% 75%)" }} />
            </div>

            {/* PASSÉS */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(228 15% 55%)" }} />
                <span className="section-label">— Ils ont eu lieu</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-grotesk font-bold mt-2 mb-8 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
                Événements passés
              </h2>
              <div className="space-y-4">
                {past.length > 0 ? (
                  past.map((ev) => renderEventCard(ev, true))
                ) : (
                  <p className="text-sm py-8 italic" style={{ color: "hsl(228 15% 55%)" }}>
                    Aucun événement passé pour ces critères.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CARROUSEL PHOTOS DES DERNIERS ÉVÉNEMENTS */}
        <EventsPhotoCarousel
          surface="navy"
          label="En images"
          heading="Les moments qui comptent."
          intro="Photos des derniers After Proche et dîners."
          limit={3}
          perEvent={6}
          height="h-[340px] md:h-[500px]"
        />

        {/* PARTENAIRES */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-16 md:py-20">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="section-label">— Nos partenaires</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-grotesk font-bold tracking-tight mb-8" style={{ color: "hsl(228 56% 10%)" }}>
              Ils nous accueillent
            </h2>
            <div className="flex flex-wrap gap-3">
              {partners.map((p) => (
                <div key={p} className="px-5 py-2.5 rounded-lg font-grotesk font-medium text-sm bg-white" style={{ border: "1px solid hsl(228 10% 85%)", color: "hsl(228 56% 10%)" }}>
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden gradient-mesh-bg">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-24 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white mb-3">
              Le prochain After Proche se fait{" "}
              <span className="font-serif-accent text-primary">avec vous.</span>
            </h2>
            <p className="text-white/50 text-sm mb-8">Événement réservé aux Futuristes</p>
            <Link to="/candidater" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-grotesk font-semibold text-base transition-all duration-300 hover:scale-105" style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}>
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
