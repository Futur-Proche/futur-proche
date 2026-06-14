import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const formatLabels: Record<string, string> = {
  after_proche: "After Proche",
  diner: "Dîner",
  workshop: "Workshop",
  autre: "Événement",
};

export const EventsTeaserSection = () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data: events } = useQuery({
    queryKey: ["home-upcoming-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("id, slug, titre, date, heure, ville, lieu, format, image_url, statut")
        .eq("statut", "published")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(3);
      return data ?? [];
    },
  });

  if (!events || events.length === 0) return null;

  return (
    <section className="section-cream">
      <div className="container mx-auto px-6 lg:px-12 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="section-label inline-block mb-3">— Prochains rendez-vous</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
              Les <span className="font-serif-accent italic text-primary">prochains</span> événements
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.map((ev) => {
            const d = new Date(ev.date + "T00:00:00");
            const day = d.getDate();
            const month = d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase().replace(".", "");
            return (
              <Link
                key={ev.id}
                to={`/evenements/${ev.slug ?? ev.id}`}
                className="group bg-white rounded-2xl overflow-hidden block card-lift"
                style={{ border: "1px solid hsl(228 10% 85%)" }}
              >
                {ev.image_url ? (
                  <div className="relative h-40 overflow-hidden">
                    <img src={ev.image_url} alt={ev.titre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute top-3 left-3 bg-white rounded-lg px-2 py-1 text-center shadow-sm">
                      <p className="text-[9px] font-mono uppercase text-primary leading-none">{month}</p>
                      <p className="text-base font-grotesk font-bold leading-none mt-0.5" style={{ color: "hsl(228 56% 10%)" }}>{day}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(228 56% 12%), hsl(248 60% 20%))" }}>
                    <div className="text-center">
                      <p className="text-[10px] font-mono uppercase text-primary">{month}</p>
                      <p className="text-3xl font-grotesk font-bold text-white">{day}</p>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "hsl(186 60% 32%)" }}>
                    {formatLabels[ev.format] ?? ev.format}
                  </span>
                  <h3 className="text-base font-grotesk font-semibold mt-1.5 mb-2 leading-snug" style={{ color: "hsl(228 56% 10%)" }}>
                    {ev.titre}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: "hsl(228 15% 50%)" }}>
                    {ev.heure && (
                      <span className="flex items-center gap-1"><Calendar size={12} /> {ev.heure.slice(0, 5)}</span>
                    )}
                    {(ev.lieu || ev.ville) && (
                      <span className="flex items-center gap-1"><MapPin size={12} /> {ev.ville}</span>
                    )}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono font-medium group-hover:gap-2 transition-all" style={{ color: "hsl(186 60% 32%)" }}>
                    Voir & s'inscrire <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventsTeaserSection;
