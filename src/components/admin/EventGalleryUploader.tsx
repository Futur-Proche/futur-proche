import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

export interface GalleryItem {
  url: string;
  alt?: string;
}

interface Props {
  eventId: string;
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}

export const EventGalleryUploader = ({ eventId, items, onChange }: Props) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: GalleryItem[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `gallery/${eventId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("event-images")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from("event-images").getPublicUrl(path);
        uploaded.push({ url: data.publicUrl, alt: "" });
      }
      onChange([...items, ...uploaded]);
      toast({ title: `${uploaded.length} photo(s) ajoutée(s)` });
    } catch (e: any) {
      toast({ title: "Upload échoué", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const updateAlt = (i: number, alt: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, alt } : it)));

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden"
            style={{ background: "hsl(228 40% 10%)", border: "1px solid hsl(228 30% 22%)" }}
          >
            <div className="relative aspect-[4/3]">
              <img src={it.url} alt={it.alt ?? ""} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              <input
                value={it.alt ?? ""}
                onChange={(e) => updateAlt(i, e.target.value)}
                placeholder="Légende (alt)"
                className="w-full text-[11px] rounded px-2 py-1 text-white outline-none"
                style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 20%)" }}
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="flex-1 py-1 rounded text-white/40 hover:text-white disabled:opacity-30"
                  style={{ background: "hsl(228 40% 14%)" }}
                >
                  <ArrowUp className="w-3 h-3 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="flex-1 py-1 rounded text-white/40 hover:text-white disabled:opacity-30"
                  style={{ background: "hsl(228 40% 14%)" }}
                >
                  <ArrowDown className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-grotesk text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        style={{ border: "1px solid hsl(186 79% 47% / 0.3)" }}
      >
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        {uploading ? "Upload en cours…" : "Ajouter des photos"}
      </button>
    </div>
  );
};
