import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

type GalleryItem = { url: string; alt?: string };

type Slide = {
  url: string;
  alt: string;
  eventTitle: string;
  eventDate: string;
  eventSlug: string;
};

type Variant = "default" | "marquee";

type Props = {
  variant?: Variant;
  limit?: number; // max events to pull from (most recent past)
  perEvent?: number; // max photos per event
  height?: string;
  heading?: string;
  label?: string;
  intro?: string;
  surface?: "cream" | "navy";
};

const formatFr = (d: string) => {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

export const EventsPhotoCarousel = ({
  variant = "default",
  limit = 3,
  perEvent = 6,
  height = "h-[320px] md:h-[460px]",
  heading,
  label,
  intro,
  surface = "cream",
}: Props) => {
  const { data: events } = useQuery({
    queryKey: ["past-events-with-gallery", limit],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("events")
        .select("titre, slug, date, gallery, statut")
        .or(`statut.eq.past,date.lt.${today}`)
        .order("date", { ascending: false })
        .limit(15);
      return data ?? [];
    },
  });

  const slides = useMemo<Slide[]>(() => {
    const out: Slide[] = [];
    let used = 0;
    for (const ev of events ?? []) {
      const g = ((ev as any).gallery as GalleryItem[] | null) ?? [];
      const items = g.filter((i) => i?.url).slice(0, perEvent);
      if (items.length === 0) continue;
      used += 1;
      for (const it of items) {
        out.push({
          url: it.url,
          alt: it.alt ?? ev.titre,
          eventTitle: ev.titre,
          eventDate: formatFr(ev.date),
          eventSlug: ev.slug ?? "",
        });
      }
      if (used >= limit) break;
    }
    return out;
  }, [events, limit, perEvent]);

  // Default variant — single-slide carousel with controls
  const [idx, setIdx] = useState(0);
  const total = slides.length;
  const next = useCallback(() => setIdx((p) => (p + 1) % Math.max(total, 1)), [total]);
  const prev = useCallback(() => setIdx((p) => (p - 1 + total) % Math.max(total, 1)), [total]);
  useEffect(() => {
    if (variant !== "default" || total <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, variant, total]);

  if (slides.length === 0) return null;

  const surfaceCls = surface === "navy" ? "section-navy" : "section-cream";
  const headingColor = surface === "navy" ? "white" : "hsl(228 56% 10%)";
  const introColor = surface === "navy" ? "rgba(255,255,255,0.6)" : "hsl(228 15% 45%)";

  return (
    <section className={`${surfaceCls} relative`}>
      {surface === "navy" && <div className="dot-grid" />}
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-16 md:py-20">
        {(label || heading) && (
          <div className="mb-8 max-w-2xl">
            {label && <span className="section-label inline-block mb-3">— {label}</span>}
            {heading && (
              <h2 className="text-2xl md:text-3xl font-grotesk font-bold tracking-tight" style={{ color: headingColor }}>
                {heading}
              </h2>
            )}
            {intro && <p className="mt-2 text-sm md:text-base" style={{ color: introColor }}>{intro}</p>}
          </div>
        )}

        {variant === "marquee" ? (
          <div className="relative overflow-hidden">
            <div
              className="flex gap-4"
              style={{
                width: "max-content",
                animation: `fp-marquee ${Math.max(slides.length * 6, 30)}s linear infinite`,
              }}
            >
              {[...slides, ...slides].map((s, i) => (
                <Link
                  to={s.eventSlug ? `/evenements/${s.eventSlug}` : "/evenements"}
                  key={`${s.url}-${i}`}
                  className="group relative block flex-shrink-0 w-[280px] md:w-[360px] aspect-[4/3] rounded-2xl overflow-hidden bg-black/20"
                >
                  <img src={s.url} alt={s.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-3 bottom-3 right-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-0.5">{s.eventDate}</p>
                    <p className="text-white font-grotesk font-semibold text-sm leading-tight line-clamp-2">{s.eventTitle}</p>
                  </div>
                </Link>
              ))}
            </div>
            <style>{`
              @keyframes fp-marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        ) : (
          <div className={`relative overflow-hidden rounded-2xl ${height}`}>
            <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {slides.map((s, i) => (
                <Link to={s.eventSlug ? `/evenements/${s.eventSlug}` : "/evenements"} key={i} className="min-w-full h-full relative block">
                  <img src={s.url} alt={s.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-1">{s.eventDate}</p>
                    <p className="text-white font-grotesk font-semibold text-base md:text-lg">{s.eventTitle}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button onClick={prev} aria-label="Précédent" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "hsl(228 56% 10% / 0.55)" }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} aria-label="Suivant" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "hsl(228 56% 10% / 0.55)" }}>
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-white/50"}`} />
              ))}
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-white" style={{ background: "hsl(228 56% 10% / 0.55)" }}>
              <Camera className="w-3 h-3 text-primary" /> {idx + 1} / {total}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPhotoCarousel;
