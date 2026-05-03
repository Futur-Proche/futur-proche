import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toPng } from "html-to-image";
import { Download, Plus, Search, X, Image, UserPlus, Users } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface Speaker {
  prenom: string;
  nom: string;
  entreprise: string;
  photo_url?: string | null;
  isMember?: boolean;
}

interface EventVisualGeneratorProps {
  event: {
    titre: string;
    format: string;
    date: string;
    heure?: string | null;
    ville?: string | null;
    lieu?: string | null;
  };
  eventNumber?: number;
  onClose: () => void;
}

const formatLabels: Record<string, string> = {
  after_proche: "After Proche",
  diner: "Dîner",
  workshop: "Workshop",
  autre: "Autre",
};

const EventVisualGenerator = ({ event, eventNumber, onClose }: EventVisualGeneratorProps) => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [subtitle, setSubtitle] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [showExternalForm, setShowExternalForm] = useState(false);
  const [externalSpeaker, setExternalSpeaker] = useState<Speaker>({ prenom: "", nom: "", entreprise: "" });
  const [externalPhotoFile, setExternalPhotoFile] = useState<File | null>(null);
  const [externalPhotoPreview, setExternalPhotoPreview] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  const { data: profiles } = useQuery({
    queryKey: ["profiles-for-visual"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("nom");
      if (error) throw error;
      return data as Profile[];
    },
  });

  const filteredProfiles = profiles?.filter(
    (p) =>
      !speakers.some((s) => s.isMember && s.prenom === p.prenom && s.nom === p.nom) &&
      (`${p.prenom} ${p.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.entreprise ?? "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addMember = (profile: Profile) => {
    setSpeakers([...speakers, {
      prenom: profile.prenom,
      nom: profile.nom,
      entreprise: profile.entreprise ?? "",
      photo_url: profile.photo_url,
      isMember: true,
    }]);
    setShowMemberSearch(false);
    setSearchQuery("");
  };

  const handleExternalPhoto = (file: File) => {
    setExternalPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setExternalPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const addExternal = () => {
    if (!externalSpeaker.prenom || !externalSpeaker.nom) return;
    setSpeakers([...speakers, {
      ...externalSpeaker,
      photo_url: externalPhotoPreview,
      isMember: false,
    }]);
    setShowExternalForm(false);
    setExternalSpeaker({ prenom: "", nom: "", entreprise: "" });
    setExternalPhotoFile(null);
    setExternalPhotoPreview(null);
  };

  const removeSpeaker = (idx: number) => {
    setSpeakers(speakers.filter((_, i) => i !== idx));
  };

  const downloadImage = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      // Wait for fonts and images to load
      await new Promise((r) => setTimeout(r, 500));
      const dataUrl = await toPng(ref.current, {
        pixelRatio: 2,
        cacheBust: true,
        fetchRequestInit: { mode: "cors" },
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
    setDownloading(false);
  };

  const dateObj = new Date(event.date + "T00:00:00");
  const monthShort = dateObj.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase().replace(".", "");
  const dayNum = dateObj.getDate();
  const formatLabel = formatLabels[event.format] || event.format;

  const inputClass = "w-full rounded-lg px-3 py-2 text-sm text-white outline-none bg-[hsl(228_40%_12%)] border border-[hsl(228_30%_25%)]";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8" style={{ background: "rgba(0,0,0,0.8)" }}>
      <div className="w-full max-w-6xl rounded-2xl p-6 space-y-6" style={{ background: "hsl(228 56% 10%)", border: "1px solid hsl(228 30% 22%)" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-grotesk font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" /> Générateur de visuels
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Sous-titre (italique)</label>
            <input className={inputClass} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Quand est-ce que ça paie ?" style={{ fontFamily: "var(--font-grotesk)" }} />
          </div>
          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Partenaire (optionnel)</label>
            <input className={inputClass} value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Back Market" style={{ fontFamily: "var(--font-grotesk)" }} />
          </div>
        </div>

        {/* Speakers management */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-white/40 font-mono uppercase">Intervenants ({speakers.length})</span>
            <button onClick={() => setShowMemberSearch(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-grotesk bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Users className="w-3 h-3" /> Membre
            </button>
            <button onClick={() => setShowExternalForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-grotesk bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
              <UserPlus className="w-3 h-3" /> Externe
            </button>
          </div>

          {/* Member search dropdown */}
          {showMemberSearch && (
            <div className="rounded-xl p-4 mb-3 space-y-3" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 25%)" }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input className={`${inputClass} pl-9`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un membre..." autoFocus style={{ fontFamily: "var(--font-grotesk)" }} />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredProfiles?.slice(0, 10).map((p) => (
                  <button key={p.id} onClick={() => addMember(p)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                    {p.photo_url ? (
                      <img src={p.photo_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-grotesk text-primary">
                        {p.prenom[0]}{p.nom[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-grotesk text-white">{p.prenom} {p.nom}</p>
                      <p className="text-xs text-white/40">{p.entreprise}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMemberSearch(false)} className="text-xs text-white/30 hover:text-white/50">Fermer</button>
            </div>
          )}

          {/* External speaker form */}
          {showExternalForm && (
            <div className="rounded-xl p-4 mb-3 space-y-3" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 25%)" }}>
              <div className="grid grid-cols-3 gap-3">
                <input className={inputClass} value={externalSpeaker.prenom} onChange={(e) => setExternalSpeaker({ ...externalSpeaker, prenom: e.target.value })} placeholder="Prénom" style={{ fontFamily: "var(--font-grotesk)" }} />
                <input className={inputClass} value={externalSpeaker.nom} onChange={(e) => setExternalSpeaker({ ...externalSpeaker, nom: e.target.value })} placeholder="Nom" style={{ fontFamily: "var(--font-grotesk)" }} />
                <input className={inputClass} value={externalSpeaker.entreprise} onChange={(e) => setExternalSpeaker({ ...externalSpeaker, entreprise: e.target.value })} placeholder="Entreprise" style={{ fontFamily: "var(--font-grotesk)" }} />
              </div>
              <div>
                <label className="block text-xs text-white/40 font-mono uppercase mb-1">Photo</label>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleExternalPhoto(e.target.files[0])} className="text-xs text-white/40" />
                {externalPhotoPreview && <img src={externalPhotoPreview} className="w-12 h-12 rounded-full object-cover mt-2" alt="" />}
              </div>
              <div className="flex gap-2">
                <button onClick={addExternal} className="px-4 py-1.5 rounded-lg text-xs font-grotesk bg-primary text-primary-foreground">Ajouter</button>
                <button onClick={() => setShowExternalForm(false)} className="text-xs text-white/30 hover:text-white/50">Annuler</button>
              </div>
            </div>
          )}

          {/* Speaker list */}
          {speakers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {speakers.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-grotesk" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 25%)" }}>
                  {s.photo_url ? (
                    <img src={s.photo_url} className="w-6 h-6 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">
                      {s.prenom[0]}{s.nom[0]}
                    </div>
                  )}
                  <span className="text-white">{s.prenom} {s.nom[0]}.</span>
                  <span className="text-white/30">{s.entreprise}</span>
                  <button onClick={() => removeSpeaker(i)} className="text-white/20 hover:text-red-400"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview & Download */}
        <div className="space-y-8">
          {/* Banner 16:9 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-white/40">Event Poster · LinkedIn 16:9</span>
              <button
                onClick={() => downloadImage(bannerRef, `${event.titre.replace(/\s+/g, "-")}-banner.png`)}
                disabled={downloading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-grotesk bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                <Download className="w-3 h-3" /> Télécharger Banner
              </button>
            </div>
            <div className="overflow-x-auto">
              <div
                ref={bannerRef}
                style={{
                  width: 1200,
                  height: 675,
                  position: "relative",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #0B1026 0%, #1a1545 50%, #0B1026 100%)",
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                {/* Mesh aurora bottom glow */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
                  background: "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(25,196,218,0.2) 0%, transparent 60%)",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, left: "20%", right: "20%", height: "40%",
                  background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.15) 0%, transparent 60%)",
                }} />

                {/* Top left info */}
                <div style={{ position: "absolute", top: 36, left: 48 }}>
                  <div style={{ fontSize: 12, letterSpacing: "0.15em", color: "#19C4DA", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
                    ✦ {formatLabel}{eventNumber ? ` · N°${String(eventNumber).padStart(2, "0")}` : ""}
                  </div>
                  {partnerName && (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
                      futur proche × {partnerName}
                    </div>
                  )}
                </div>

                {/* Date badge top right */}
                <div style={{
                  position: "absolute", top: 28, right: 48,
                  border: "1px solid rgba(25,196,218,0.4)", borderRadius: 8,
                  padding: "8px 16px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#19C4DA", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {monthShort}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "white", lineHeight: 1 }}>
                    {dayNum}
                  </div>
                </div>

                {/* Title */}
                <div style={{ position: "absolute", top: 90, left: 48, right: 200 }}>
                  <div style={{ fontSize: 40, fontWeight: 700, color: "white", lineHeight: 1.15 }}>
                    {event.titre}
                  </div>
                  {subtitle && (
                    <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginTop: 4 }}>
                      {subtitle}
                    </div>
                  )}
                </div>

                {/* Speakers */}
                {speakers.length > 0 && (
                  <div style={{
                    position: "absolute", bottom: 0, left: 48, right: 48,
                    display: "flex", alignItems: "flex-end",
                    gap: speakers.length <= 3 ? 0 : 0,
                  }}>
                    {speakers.map((s, i) => {
                      const speakerWidth = Math.min(280, (1200 - 96) / speakers.length);
                      return (
                        <div key={i} style={{ width: speakerWidth, position: "relative" }}>
                          {/* Speaker photo/silhouette */}
                          <div style={{
                            width: speakerWidth, height: speakerWidth * 1.1,
                            position: "relative", overflow: "hidden",
                            background: "linear-gradient(180deg, transparent 0%, rgba(25,196,218,0.08) 60%, rgba(25,196,218,0.15) 100%)",
                            borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                          }}>
                            {s.photo_url ? (
                              <img
                                src={s.photo_url}
                                crossOrigin="anonymous"
                                style={{
                                  width: "100%", height: "100%",
                                  objectFit: "cover", objectPosition: "top center",
                                  filter: "grayscale(30%) contrast(1.1)",
                                  opacity: 0.85,
                                }}
                                alt=""
                              />
                            ) : (
                              <svg viewBox="0 0 100 110" style={{ width: "100%", height: "100%", opacity: 0.3 }}>
                                <circle cx="50" cy="35" r="20" fill="rgba(255,255,255,0.4)" />
                                <ellipse cx="50" cy="95" rx="30" ry="25" fill="rgba(255,255,255,0.3)" />
                              </svg>
                            )}
                            {/* Gradient overlay */}
                            <div style={{
                              position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
                              background: "linear-gradient(180deg, transparent 0%, rgba(11,16,38,0.9) 100%)",
                            }} />
                          </div>
                          {/* Name & company */}
                          <div style={{
                            position: "absolute", bottom: 16, left: 12, right: 8,
                          }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "white" }}>
                              {s.prenom} {s.nom[0]}.
                            </div>
                            <div style={{
                              fontSize: 10, color: "rgba(255,255,255,0.4)",
                              fontFamily: "'JetBrains Mono', monospace",
                              textTransform: "uppercase", letterSpacing: "0.05em",
                            }}>
                              {s.entreprise}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Square 1080x1080 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-white/40">Podcast Cover · 1080×1080</span>
              <button
                onClick={() => downloadImage(squareRef, `${event.titre.replace(/\s+/g, "-")}-square.png`)}
                disabled={downloading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-grotesk bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                <Download className="w-3 h-3" /> Télécharger Carré
              </button>
            </div>
            <div className="overflow-x-auto">
              <div
                ref={squareRef}
                style={{
                  width: 540,
                  height: 540,
                  position: "relative",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #0B1026 0%, #1a1545 50%, #0B1026 100%)",
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                {/* Mesh aurora */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "70%",
                  background: "radial-gradient(ellipse 100% 80% at 50% 100%, rgba(25,196,218,0.2) 0%, transparent 55%)",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, left: "15%", right: "15%", height: "50%",
                  background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.15) 0%, transparent 55%)",
                }} />

                {/* Decorative elements top */}
                <div style={{ position: "absolute", top: 20, right: 30, opacity: 0.15 }}>
                  <svg width="60" height="80" viewBox="0 0 60 80">
                    <line x1="10" y1="10" x2="10" y2="70" stroke="white" strokeWidth="2" />
                    <line x1="20" y1="20" x2="20" y2="60" stroke="white" strokeWidth="2" />
                    <line x1="30" y1="5" x2="30" y2="75" stroke="white" strokeWidth="2" />
                    <line x1="40" y1="15" x2="40" y2="65" stroke="white" strokeWidth="2" />
                    <line x1="50" y1="25" x2="50" y2="55" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <div style={{ position: "absolute", top: 30, right: 100, opacity: 0.2 }}>
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <path d="M5 15 L15 5 L25 15" stroke="white" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>

                {/* Top header */}
                <div style={{ position: "absolute", top: 24, left: 28, right: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>✦</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>futur proche</span>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                    {eventNumber ? `N°${String(eventNumber).padStart(2, "0")}` : ""}
                  </span>
                </div>

                {/* Speakers in square layout */}
                {speakers.length > 0 && (
                  <div style={{
                    position: "absolute", top: 70, left: 28, right: 28,
                    display: "flex", justifyContent: "center", gap: 8,
                    height: 260,
                  }}>
                    {speakers.map((s, i) => {
                      const cardWidth = Math.min(140, (540 - 56 - (speakers.length - 1) * 8) / speakers.length);
                      return (
                        <div key={i} style={{
                          width: cardWidth, height: "100%",
                          borderRadius: 12, overflow: "hidden",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          position: "relative",
                        }}>
                          {s.photo_url ? (
                            <img
                              src={s.photo_url}
                              crossOrigin="anonymous"
                              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", filter: "grayscale(30%)", opacity: 0.7 }}
                              alt=""
                            />
                          ) : (
                            <svg viewBox="0 0 100 130" style={{ width: "100%", height: "100%", opacity: 0.25 }}>
                              <circle cx="50" cy="40" r="22" fill="rgba(255,255,255,0.4)" />
                              <ellipse cx="50" cy="110" rx="32" ry="28" fill="rgba(255,255,255,0.3)" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Category label */}
                <div style={{ position: "absolute", bottom: 120, left: 28 }}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#19C4DA", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                    ✦ {formatLabel}
                  </div>
                </div>

                {/* Title bottom */}
                <div style={{ position: "absolute", bottom: 50, left: 28, right: 28 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
                    {subtitle ? (
                      <>
                        Et si <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>{subtitle}</span> ?
                      </>
                    ) : (
                      event.titre
                    )}
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.3)", marginTop: 6, letterSpacing: "0.05em" }}>
                    {speakers.length} INVITÉ{speakers.length > 1 ? "S" : ""}
                    {event.heure ? ` · ${event.heure?.replace(":", "H")}` : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventVisualGenerator;
