import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Globe } from "lucide-react";
import { RegistrationBlock } from "@/components/event/RegistrationBlock";
import { ParticipantsList } from "@/components/event/ParticipantsList";
import { EventGallery, type GalleryItem } from "@/components/event/EventGallery";
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

const EvenementDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event-detail", slug],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("slug", slug!).maybeSingle();
      return data;
    },
  });

  const { data: regCount } = useQuery({
    queryKey: ["event-regs-count", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      const { data } = await supabase.rpc("get_event_registrations_count", { _event_id: event!.id });
      return (data as number | null) ?? 0;
    },
  });

  const { data: isUserRegisteredData, isLoading: regLoading } = useQuery({
    queryKey: ["event-is-registered", event?.id, user?.id],
    enabled: !!event?.id && !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_registered_to_event", {
        _event_id: event!.id,
        _user_id: user!.id,
      });
      if (error) throw error;
      return !!data;
    },
  });

  const isUserRegistered = !!isUserRegisteredData;
  const isRegistrationStatusLoading = !!user && regLoading;
  const registrationsCount = regCount ?? 0;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="section-navy min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-6 lg:px-12 text-white/40">Chargement…</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <main className="section-navy min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <p className="text-white/60 mb-6">Événement introuvable.</p>
            <Link to="/evenements" className="text-primary underline">Retour aux événements</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const speakers = (event.speakers as unknown as Speaker[] | null) ?? [];
  const gallery = (((event as any).gallery as unknown as GalleryItem[] | null) ?? []).filter(Boolean);
  const recap = ((event as any).recap as string | null) ?? null;
  const eventDate = new Date(event.date);
  const dayLabel = eventDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const isPast = event.statut === "past" || eventDate < new Date(new Date().toDateString());

  const seoTitle = `${event.titre} — futur proche`;
  const seoDesc =
    (event.description as string | null)?.slice(0, 155) ??
    `Rejoignez ${event.titre} avec futur proche, communauté des leaders Marketing & Comm.`;
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.titre,
    startDate: event.date,
    eventStatus: isPast ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.lieu
      ? { "@type": "Place", name: event.lieu, address: event.lieu }
      : undefined,
    image: event.image_url ?? undefined,
    description: seoDesc,
    organizer: { "@type": "Organization", name: "futur proche", url: "https://futurproche.com" },
  };

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDesc}
        path={`/evenements/${slug}`}
        image={event.image_url ?? undefined}
        type="article"
        jsonLd={eventJsonLd}
      />
      <Navbar />
      <main className="section-navy">
        {/* Banner hero (if image) */}
        {event.image_url && (
          <section className="relative w-full pt-20">
            <div className="relative h-[280px] md:h-[420px] overflow-hidden">
              <img
                src={event.image_url}
                alt={event.titre}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(228_45%_8%)] via-[hsl(228_45%_8%)]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 container mx-auto px-6 lg:px-12 pb-6">
                <Link to="/evenements" className="inline-flex items-center gap-2 text-white/70 text-xs font-mono uppercase tracking-wider mb-3 hover:text-primary transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Tous les événements
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary px-2 py-0.5 rounded-full bg-primary/15">
                    {formatLabels[event.format] ?? event.format}
                  </span>
                  {event.is_open_to_all ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-400/15 text-emerald-400">
                      <Globe className="w-3 h-3" /> Ouvert à tous
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-white/80">
                      Réservé membres
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hero */}
        <section className="relative pt-10 pb-12 md:pt-14 md:pb-16" style={!event.image_url ? { paddingTop: "7rem" } : undefined}>
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 lg:px-12">
            {!event.image_url && (
              <Link to="/evenements" className="inline-flex items-center gap-2 text-white/50 text-xs font-mono uppercase tracking-wider mb-6 hover:text-primary transition-colors">
                <ArrowLeft className="w-3 h-3" /> Tous les événements
              </Link>
            )}

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                {!event.image_url && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                      {formatLabels[event.format] ?? event.format}
                    </span>
                    {event.is_open_to_all ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-400/10 text-emerald-400">
                        <Globe className="w-3 h-3" /> Ouvert à tous
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-primary/10 text-primary">
                        Réservé membres
                      </span>
                    )}
                  </div>
                )}
                <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.15] mb-6">
                  {event.titre}
                </h1>


                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Date</p>
                      <p className="text-sm text-white capitalize">{dayLabel}</p>
                    </div>
                  </div>
                  {event.heure && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Heure</p>
                        <p className="text-sm text-white">{event.heure.slice(0, 5)}</p>
                      </div>
                    </div>
                  )}
                  {(event.lieu || event.ville) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Lieu</p>
                        <p className="text-sm text-white">{event.lieu ? `${event.lieu}, ${event.ville}` : event.ville}</p>
                      </div>
                    </div>
                  )}
                  {event.capacite && (
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Capacité</p>
                        <p className="text-sm text-white">{event.capacite} places</p>
                      </div>
                    </div>
                  )}
                </div>

                {event.description && (
                  <div className="mb-10">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-primary mb-3">À propos</h2>
                    {/^\s*</.test(event.description) ? (
                      <div className="prose-fp text-white/75" dangerouslySetInnerHTML={{ __html: event.description }} />
                    ) : (
                      <p className="text-white/70 text-base leading-relaxed whitespace-pre-line">{event.description}</p>
                    )}
                  </div>
                )}

                {speakers.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-primary mb-4">Speakers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {speakers.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                          {s.photo_url ? (
                            <img src={s.photo_url} alt={`${s.prenom} ${s.nom}`} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white/60" style={{ background: "hsl(228 40% 18%)" }}>
                              {(s.prenom?.[0] ?? "")}{(s.nom?.[0] ?? "")}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-grotesk font-semibold text-white">{s.prenom} {s.nom}</p>
                            <p className="text-xs text-white/50">{s.poste}{s.entreprise ? ` · ${s.entreprise}` : ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recap && (
                  <div className="mb-10">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Compte-rendu</h2>
                    {/^\s*</.test(recap) ? (
                      <div className="prose-fp text-white/80" dangerouslySetInnerHTML={{ __html: recap }} />
                    ) : (
                      <div className="text-white/75 text-base leading-relaxed whitespace-pre-line">{recap}</div>
                    )}
                  </div>
                )}

                {gallery.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-primary mb-4">
                      Galerie ({gallery.length})
                    </h2>
                    <EventGallery items={gallery} />
                  </div>
                )}

                <div>
                  <h2 className="text-xs font-mono uppercase tracking-wider text-primary mb-4">
                    Qui {isPast ? "était là" : "sera là"} ? ({registrationsCount})
                  </h2>
                  <ParticipantsList eventId={event.id} canSeeNames={!!user} count={registrationsCount} />
                </div>
              </div>

              <aside className="lg:col-span-1">
                {isPast ? (
                  <div className="rounded-2xl p-6 sticky top-24" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-white/40 mb-2">Événement passé</p>
                    <h3 className="text-lg font-grotesk font-bold text-white mb-1">A eu lieu</h3>
                    <p className="text-white/60 text-sm capitalize">{dayLabel}.</p>
                    {gallery.length > 0 && (
                      <p className="text-white/40 text-xs mt-3">📷 {gallery.length} photo{gallery.length > 1 ? "s" : ""} dans la galerie</p>
                    )}
                  </div>
                ) : (
                  <RegistrationBlock
                    event={event}
                    isUserRegistered={isUserRegistered}
                    isRegistrationStatusLoading={isRegistrationStatusLoading}
                    registrationsCount={registrationsCount}
                  />
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default EvenementDetail;
