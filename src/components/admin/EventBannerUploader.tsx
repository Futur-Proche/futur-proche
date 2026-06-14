import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface Props {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}

export const EventBannerUploader = ({ value, onChange }: Props) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Format invalide", description: "Merci de choisir une image.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image trop lourde", description: "5 Mo max.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `banners/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("event-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("event-images").getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: "Bannière mise en ligne" });
    } catch (e: any) {
      toast({ title: "Échec de l'upload", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-lg overflow-hidden" style={{ border: "1px solid hsl(228 30% 22%)" }}>
          <img src={value} alt="Bannière événement" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
            aria-label="Retirer la bannière"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 rounded-lg flex flex-col items-center justify-center gap-2 text-white/40 hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50"
          style={{ background: "hsl(228 40% 10%)", border: "1px dashed hsl(228 30% 25%)" }}
        >
          <ImageIcon className="w-6 h-6" />
          <span className="text-xs font-grotesk">
            {uploading ? "Envoi en cours…" : "Cliquer pour ajouter une bannière (16:9 recommandé)"}
          </span>
        </button>
      )}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-grotesk text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          style={{ border: "1px solid hsl(228 30% 25%)" }}
        >
          <Upload className="w-3 h-3" /> {value ? "Remplacer" : "Importer"}
        </button>
        <input
          type="url"
          placeholder="…ou coller une URL d'image"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="flex-1 px-2.5 py-1.5 rounded text-[11px] font-grotesk text-white outline-none"
          style={{ background: "hsl(228 40% 12%)", border: "1px solid hsl(228 30% 25%)" }}
        />
      </div>
    </div>
  );
};
