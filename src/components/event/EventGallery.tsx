import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface GalleryItem {
  url: string;
  alt?: string;
}

interface Props {
  items: GalleryItem[];
  className?: string;
}

export const EventGallery = ({ items, className }: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!items?.length) return null;

  const close = () => setOpenIdx(null);
  const prev = () => setOpenIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  const next = () => setOpenIdx((i) => (i === null ? null : (i + 1) % items.length));

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 ${className ?? ""}`}>
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-white/5"
          >
            <img
              src={it.url}
              alt={it.alt ?? `Photo ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0 shadow-none">
          {openIdx !== null && (
            <div className="relative">
              <img
                src={items[openIdx].url}
                alt={items[openIdx].alt ?? `Photo ${openIdx + 1}`}
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />
              <button
                onClick={close}
                className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center hover:bg-white"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
              {items.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                    aria-label="Précédent"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                    aria-label="Suivant"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {items[openIdx].alt && (
                <p className="text-center text-white/70 text-xs mt-2">{items[openIdx].alt}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
