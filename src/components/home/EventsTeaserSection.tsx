import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, ArrowRight, ExternalLink } from "lucide-react";
import { EventCountBadge } from "@/components/event/EventCountBadge";

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

type Ev = {
  id: string;
  slug: string | null;
  titre: string;
  date: string;
  heure: string | null;
  ville: string | null;
  lieu: string | null;
  format: string;
  image_url: string | null;
  capacite: number | null;
  speakers: any;
  statut: string;
};

const EventRow = ({ ev, isPast }: { ev: Ev; isPast: boolean }) => {
  const speakers = (ev.speakers as Speaker[] | null) ?? [];
  const d = new Date(ev.date + "T00:00:00");
  const monthShort = d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase().replace(".", "");
  const day = d.getDate();
  const year = d.getFullYear();

  return (
    <div
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
          <div className="hidden md:block flex-shrink-0 w-40">
            <img src={ev.image_url} alt={ev.titre} className={`w-full h-full object-cover ${isPast ? "grayscale" : ""}`} loading="lazy" />
          </div>
        )}

        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
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
            <h3 className="text-base font-grotesk font-semibold mb-2" style={{ color: "hsl(228 56% 10%)" }}>
              {ev.titre}
            </h3>
            <div className="flex flex-wrap gap-4 text-xs mb-3" style={{ color: "hsl(228 15% 50%)" }}>
              {ev.heure && !isPast && (
                <span className="flex items-center gap-1"><Calendar size={13} /> {ev.heure?.slice(0, 5)}</span>
              )}
              {(ev.lieu || ev.ville) && (
                <span className="flex items-center gap-1"><MapPin size={13} /> {ev.ville}</span>
              )}
              <EventCountBadge eventId={ev.id} capacite={ev.capacite} className="text-xs" />
            </div>
            {speakers.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {speakers.slice(0, 4).map((s, i) => (
                    s.photo_url ? (
                      <img key={i} src={s.photo_url} alt={`${s.prenom} ${s.nom}`} className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
                    ) : (
                      <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white" style={{ background: "hsl(228 56% 10%)", color: "hsl(0 0% 100% / 0.6)" }}>
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

export const EventsTeaserSection = () => {
  const today = new Date().toISOString().slice(0, 10);

  const select = "id, slug, titre, date, heure, ville, lieu, format, image_url, capacite, speakers, statut";

  const { data: upcoming } = useQuery({
    queryKey: ["home-upcoming-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select(select)
        .eq("statut", "published")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(3);
      return (data ?? []) as Ev[];
    },
  });

  const { data: past } = useQuery({
    queryKey: ["home-past-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select(select)
        .in("statut", ["published", "past"])
        .lt("date", today)
        .order("date", { ascending: false })
        .limit(3);
      return (data ?? []) as Ev[];
    },
  });

  const upcomingEmpty = !upcoming || upcoming.length === 0;
  const pastEmpty = !past || past.length === 0;

  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="section-label inline-block mb-3">— Les rendez-vous</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
              Ce qui <span className="font-serif-accent italic text-primary">arrive</span> et ce qui s'est <span className="font-serif-accent italic text-primary">passé</span>.
            </h2>
            <p className="mt-3 text-sm md:text-base" style={{ color: "hsl(228 15% 45%)" }}>
              Rencontres physiques entre leaders Marketing / Comm, dans plusieurs villes françaises.
            </p>
          </div>
          <Link
            to="/evenements"
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-sm font-grotesk font-medium group"
            style={{ color: "hsl(186 60% 32%)" }}
          >
            Tous les événements <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* À venir */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <h3 className="text-xs font-mono uppercase tracking-[2px]" style={{ color: "hsl(186 60% 32%)" }}>
              — À venir · Inscriptions ouvertes
            </h3>
          </div>

          {upcomingEmpty ? (
            <div
              className="rounded-2xl bg-white p-8 md:p-10 text-center max-w-2xl"
              style={{ border: "1px solid hsl(228 10% 85%)" }}
            >
              <h4 className="text-xl md:text-2xl font-grotesk font-semibold" style={{ color: "hsl(228 56% 10%)" }}>
                Le <span className="font-serif-accent italic text-primary">prochain rendez-vous</span> arrive bientôt.
              </h4>
              <p className="mt-2 text-sm" style={{ color: "hsl(228 15% 45%)" }}>
                Les dates des prochains After Proche et dîners sont en cours de calage.
              </p>
              <Link
                to="/candidater"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-grotesk font-medium px-5 py-2.5 rounded-full"
                style={{ background: "hsl(228 56% 10%)", color: "hsl(36 29% 93%)" }}
              >
                Être prévenu·e <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming!.map((ev) => <EventRow key={ev.id} ev={ev} isPast={false} />)}
            </div>
          )}
        </div>

        {/* Passés */}
        {!pastEmpty && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(228 15% 55%)" }} />
              <h3 className="text-xs font-mono uppercase tracking-[2px]" style={{ color: "hsl(228 15% 45%)" }}>
                — Récemment passés
              </h3>
            </div>
            <div className="space-y-4">
              {past!.map((ev) => <EventRow key={ev.id} ev={ev} isPast />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsTeaserSection;
