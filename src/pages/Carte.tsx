import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { FR_DEPARTEMENTS, deptCodeFromCp } from "@/data/fr-departements";
import { Lock, MapPin, X, Linkedin } from "lucide-react";
import { Seo } from "@/components/Seo";

const GEO_URL =
  "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson";

type Member = {
  id: string;
  prenom: string;
  nom: string;
  ville: string | null;
  poste: string | null;
  entreprise: string | null;
  photo_url: string | null;
  linkedin: string | null;
  code_postal: string | null;
};

const Carte = () => {
  const { user } = useAuth();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(GEO_URL).then((r) => r.json()).then(setGeoData).catch(() => {});
  }, []);

  const { data: members } = useQuery({
    queryKey: ["carte-members"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, prenom, nom, ville, poste, entreprise, photo_url, linkedin, code_postal");
      return (data ?? []) as Member[];
    },
  });

  const byDept = useMemo(() => {
    const map = new Map<string, Member[]>();
    (members ?? []).forEach((m) => {
      const dept = deptCodeFromCp(m.code_postal);
      if (!dept) return;
      if (!map.has(dept)) map.set(dept, []);
      map.get(dept)!.push(m);
    });
    return map;
  }, [members]);

  const total = members?.length ?? 0;
  const locatedCount = useMemo(
    () => Array.from(byDept.values()).reduce((s, arr) => s + arr.length, 0),
    [byDept]
  );

  const maxPerDept = useMemo(
    () => Math.max(1, ...Array.from(byDept.values()).map((a) => a.length)),
    [byDept]
  );

  const radius = (n: number) => 4 + Math.sqrt(n / maxPerDept) * 18;

  const selectedMembers = selectedDept ? byDept.get(selectedDept) ?? [] : [];

  return (
    <>
      <Seo title={"Carte des Futuristes — futur proche"} description={"Découvrez la carte des membres de la communauté futur proche partout en France."} path={"/carte"} />
      <Navbar />
      <main>
        <section className="section-navy relative min-h-screen pt-28 pb-20">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-10">
              <span className="section-label">— La communauté en France</span>
              <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white mt-3 mb-4 leading-[1.1]">
                Des opportunités <span className="font-serif-accent text-primary italic">partout en France.</span>
              </h1>
              <p className="text-base md:text-lg text-white/60 leading-relaxed">
                {total} Futuristes répartis sur tout le territoire. Survolez un département pour voir l'activité,{" "}
                {user ? "cliquez pour explorer les membres locaux." : "connectez-vous pour explorer les membres locaux."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              {/* Map */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ background: "hsl(36 29% 93%)", border: "1px solid hsl(228 15% 80%)" }}
              >
                {!geoData ? (
                  <div className="flex items-center justify-center h-[500px] text-sm" style={{ color: "hsl(228 15% 45%)" }}>
                    Chargement de la carte…
                  </div>
                ) : (
                  <ComposableMap
                    projection="geoConicConformal"
                    projectionConfig={{ center: [2.5, 46.5], parallels: [44, 49], scale: 2800 }}
                    width={800}
                    height={700}
                    style={{ width: "100%", height: "auto" }}
                  >
                    <Geographies geography={geoData}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const code = (geo.properties.code ?? geo.properties.CODE_DEPT) as string;
                          const count = byDept.get(code)?.length ?? 0;
                          const isSelected = selectedDept === code;
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onClick={() => count > 0 && setSelectedDept(code)}
                              style={{
                                default: {
                                  fill: isSelected ? "hsl(186 79% 47% / 0.35)" : "hsl(36 22% 86%)",
                                  stroke: "hsl(228 20% 70%)",
                                  strokeWidth: 0.5,
                                  outline: "none",
                                },
                                hover: {
                                  fill: count > 0 ? "hsl(186 79% 47% / 0.22)" : "hsl(36 22% 82%)",
                                  stroke: "hsl(186 60% 32%)",
                                  strokeWidth: 0.9,
                                  outline: "none",
                                  cursor: count > 0 ? "pointer" : "default",
                                },
                                pressed: { outline: "none" },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>

                    {Array.from(byDept.entries()).map(([code, arr]) => {
                      const info = FR_DEPARTEMENTS[code];
                      if (!info) return null;
                      const r = radius(arr.length);
                      return (
                        <Marker
                          key={code}
                          coordinates={[info.lng, info.lat]}
                          onClick={() => setSelectedDept(code)}
                          style={{ default: { cursor: "pointer" }, hover: { cursor: "pointer" }, pressed: {} }}
                        >
                          <circle r={r} fill="hsl(186 79% 38%)" fillOpacity={0.55} stroke="hsl(228 56% 10%)" strokeWidth={1.2} />
                          <text
                            textAnchor="middle"
                            y={3}
                            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, fill: "white", fontWeight: 700, pointerEvents: "none" }}
                          >
                            {arr.length}
                          </text>
                        </Marker>
                      );
                    })}
                  </ComposableMap>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider" style={{ color: "hsl(228 25% 35%)" }}>
                  <span>{locatedCount} / {total} géolocalisés</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(186 79% 38% / 0.7)" }} /> 1 membre
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full" style={{ background: "hsl(186 79% 38% / 0.7)" }} /> 10+ membres
                  </span>
                </div>
              </div>

              {/* Panel */}
              <aside className="rounded-2xl p-6" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                {!selectedDept ? (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">— Top départements</p>
                    <ul className="space-y-2">
                      {Array.from(byDept.entries())
                        .sort((a, b) => b[1].length - a[1].length)
                        .slice(0, 10)
                        .map(([code, arr]) => (
                          <li key={code}>
                            <button
                              onClick={() => setSelectedDept(code)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                            >
                              <span className="text-sm text-white/80 font-grotesk">
                                <span className="text-white/40 font-mono mr-2">{code}</span>
                                {FR_DEPARTEMENTS[code]?.nom ?? code}
                              </span>
                              <span className="text-primary font-mono text-xs">{arr.length}</span>
                            </button>
                          </li>
                        ))}
                    </ul>

                    {!user && (
                      <div className="mt-6 pt-6 border-t" style={{ borderColor: "hsl(228 30% 22%)" }}>
                        <p className="text-sm text-white/70 font-grotesk mb-3 leading-relaxed">
                          Rejoignez la communauté pour découvrir qui sont les Futuristes près de chez vous.
                        </p>
                        <Link
                          to="/candidater"
                          className="inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-grotesk font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                          Devenir Futuriste →
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-primary">— Département {selectedDept}</p>
                        <h3 className="text-lg font-grotesk font-bold text-white mt-1">
                          {FR_DEPARTEMENTS[selectedDept]?.nom}
                        </h3>
                        <p className="text-xs text-white/40 mt-0.5">{selectedMembers.length} Futuriste(s)</p>
                      </div>
                      <button onClick={() => setSelectedDept(null)} className="text-white/40 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {user ? (
                      <ul className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                        {selectedMembers.map((m) => (
                          <li
                            key={m.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                            style={{ background: "hsl(228 30% 18%)" }}
                          >
                            {m.photo_url ? (
                              <img src={m.photo_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-mono flex-shrink-0" style={{ background: "hsl(228 30% 22%)", color: "hsl(228 15% 55%)" }}>
                                {m.prenom[0]}{m.nom[0]}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-white font-grotesk font-medium truncate">{m.prenom} {m.nom}</p>
                              <p className="text-xs text-white/40 truncate">{m.poste}{m.entreprise ? ` · ${m.entreprise}` : ""}</p>
                              {m.ville && (
                                <p className="text-[10px] text-white/30 font-mono mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5" /> {m.ville}
                                </p>
                              )}
                            </div>
                            {m.linkedin && (
                              <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary/60 hover:text-primary">
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6">
                        <Lock className="w-6 h-6 mx-auto mb-3 text-primary/60" />
                        <p className="text-sm text-white/70 font-grotesk mb-4 leading-relaxed">
                          La liste des membres est réservée aux Futuristes connectés.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-grotesk text-white/80 hover:text-white" style={{ background: "hsl(228 30% 18%)" }}>
                            Se connecter
                          </Link>
                          <Link to="/candidater" className="px-4 py-2 rounded-lg text-sm font-grotesk font-semibold bg-primary text-primary-foreground hover:opacity-90">
                            Candidater →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
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

export default Carte;
