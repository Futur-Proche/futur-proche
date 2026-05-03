import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import membresFondateurs from "@/assets/membres-fondateurs.jpg";
import groupeAfterProche from "@/assets/groupe-after-proche.jpg";
import { ShieldCheck, Users, Zap, Clock, MessageSquare, TrendingUp } from "lucide-react";

const posteOptions = [
  "Dir. Marketing / Com ou assimilé",
  "VP Marketing / Com ou assimilé",
  "CMO ou assimilé",
  "Head of Marketing / Com ou assimilé",
  "Responsable Marketing / Comm ou assimilé",
  "Expert·e Senior (copywriting, ads, SEA, SEO etc.)",
  "Autre",
];

const secteurOptions = [
  "Si indépendant·e, ne rien indiquer",
  "SaaS / Logiciels",
  "Marketplace",
  "E-commerce / DTC",
  "Retail / Distribution",
  "FMCG / Grande Conso",
  "Luxe / Mode / Beauté",
  "FinTech / Assurances / Finances",
  "Santé / Pharma / HealthTech",
  "Industrie / Énergie / BTP",
  "Médias / Édition / Divertissement",
  "Éducation / Formation",
  "Tourisme / Hospitality / Voyages",
  "Agence / Conseil / Services Marketing",
  "Autre",
];

interface FormData {
  prenom: string;
  nom: string;
  poste: string;
  entreprise: string;
  secteur: string;
  email: string;
  telephone: string;
  linkedin: string;
  cooptation: string;
}

const reassurance = [
  { icon: ShieldCheck, title: "Accès sélectif", text: "Chaque candidature est examinée individuellement. Nous acceptons ~60 % des demandes." },
  { icon: Users, title: "850+ leaders réunis", text: "CMO, VP, Head of Marketing / Comm de toutes tailles d'entreprise et tous secteurs." },
  { icon: MessageSquare, title: "Échanges quotidiens", text: "Un groupe WhatsApp actif où poser vos vraies questions — et obtenir de vraies réponses." },
  { icon: Zap, title: "30+ événements", text: "After Proche, masterclasses, déjeuners thématiques à Paris, Lyon, Bordeaux et plus." },
  { icon: TrendingUp, title: "Contenus exclusifs", text: "Études, benchmarks, podcast — des ressources créées par et pour la communauté." },
  { icon: Clock, title: "Réponse sous 48h", text: "Notre équipe revient vers vous rapidement. Pas de file d'attente interminable." },
];

const Candidater = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    prenom: "",
    nom: "",
    poste: "",
    entreprise: "",
    secteur: "",
    email: "",
    telephone: "",
    linkedin: "",
    cooptation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("candidatures").insert({
      prenom: form.prenom,
      nom: form.nom,
      poste: form.poste,
      entreprise: form.entreprise || null,
      secteur: form.secteur || null,
      email: form.email,
      telephone: form.telephone || null,
      linkedin: form.linkedin || null,
      cooptation: form.cooptation || null,
    });

    if (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue. Veuillez réessayer.", variant: "destructive" });
    } else {
      toast({ title: "Candidature envoyée !", description: "Nous reviendrons vers vous sous 48h." });
      setForm({ prenom: "", nom: "", poste: "", entreprise: "", secteur: "", email: "", telephone: "", linkedin: "", cooptation: "" });
    }
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full rounded-xl border px-4 py-3.5 text-sm font-grotesk outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white shadow-sm";
  const labelClass = "block text-sm font-grotesk font-medium mb-1.5";

  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO + FORM ── */}
        <section className="section-navy relative overflow-hidden">
          <div className="orb orb--cyan w-[500px] h-[500px] top-[-15%] right-[5%]" />
          <div className="dot-grid" />
          <div className="grain-overlay" />

          <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left — pitch */}
              <div className="lg:sticky lg:top-28">
                <span className="section-label mb-4 inline-block">— Rejoindre la communauté</span>
                <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-grotesk font-bold tracking-tight text-white mt-3 mb-5 leading-[1.12]">
                  Les meilleures décisions Marketing se prennent{" "}
                  <span className="font-serif-accent text-primary italic">entre pairs.</span>
                </h1>
                <p className="text-base md:text-lg text-white/60 max-w-xl leading-relaxed mb-8">
                  Rejoignez 850+ leaders Marketing / Comm qui échangent chaque jour sur leurs vrais sujets. Candidature gratuite, admission sélective.
                </p>

                {/* FOMO banner */}
                <div
                  className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-8"
                  style={{ background: "hsl(186 79% 47% / 0.1)", border: "1px solid hsl(186 79% 47% / 0.25)" }}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                  </span>
                  <span className="text-sm font-grotesk text-white/80">
                    <strong className="text-primary">47 candidatures</strong> reçues ce mois-ci · Places limitées
                  </span>
                </div>

                {/* Témoignage */}
                <div className="hidden lg:block rounded-xl p-5 relative" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-t-xl" />
                  <p className="font-serif-accent italic text-white/70 text-sm leading-relaxed mb-2">
                    "En 3 mois chez futur proche, j'ai plus appris sur mon métier qu'en 2 ans de conférences."
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-primary">
                    — CMO, Scale-up SaaS · Membre depuis 2024
                  </p>
                </div>
              </div>

              {/* Right — form */}
              <div className="rounded-2xl p-6 md:p-8" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <h2 className="text-xl font-grotesk font-bold text-white mb-1">Déposez votre candidature</h2>
                <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-6">2 minutes · Gratuit · Réponse sous 48h</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="prenom" className={labelClass + " text-white/70"}>Prénom</label>
                      <input id="prenom" name="prenom" type="text" required value={form.prenom} onChange={handleChange} className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: "white" }} />
                    </div>
                    <div>
                      <label htmlFor="nom" className={labelClass + " text-white/70"}>Nom</label>
                      <input id="nom" name="nom" type="text" required value={form.nom} onChange={handleChange} className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: "white" }} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="poste" className={labelClass + " text-white/70"}>Poste</label>
                    <select id="poste" name="poste" required value={form.poste} onChange={handleChange} className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: form.poste ? "white" : "hsl(228 15% 45%)" }}>
                      <option value="" disabled>Quel job exercez-vous ? (indé ou salarié·e)</option>
                      {posteOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="entreprise" className={labelClass + " text-white/70"}>Entreprise</label>
                      <input id="entreprise" name="entreprise" type="text" required value={form.entreprise} onChange={handleChange} placeholder="Si indépendant·e, indiquer 'Indé'" className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: "white" }} />
                    </div>
                    <div>
                      <label htmlFor="secteur" className={labelClass + " text-white/70"}>Secteur</label>
                      <select id="secteur" name="secteur" required value={form.secteur} onChange={handleChange} className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: form.secteur ? "white" : "hsl(228 15% 45%)" }}>
                        <option value="" disabled>Choisissez</option>
                        {secteurOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="email" className={labelClass + " text-white/70"}>E-mail</label>
                      <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: "white" }} />
                    </div>
                    <div>
                      <label htmlFor="telephone" className={labelClass + " text-white/70"}>Téléphone</label>
                      <input id="telephone" name="telephone" type="tel" required value={form.telephone} onChange={handleChange} placeholder="Pour le groupe WhatsApp" className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: "white" }} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="linkedin" className={labelClass + " text-white/70"}>Profil LinkedIn</label>
                    <input id="linkedin" name="linkedin" type="url" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: "white" }} />
                  </div>

                  <div>
                    <label htmlFor="cooptation" className={labelClass + " text-white/70"}>Coopté·e par un membre ?</label>
                    <input id="cooptation" name="cooptation" type="text" value={form.cooptation} onChange={handleChange} placeholder="Nom du membre (facultatif — ça accélère 😉)" className={inputClass} style={{ background: "hsl(228 30% 18%)", borderColor: "hsl(228 30% 25%)", color: "white" }} />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-7 py-4 rounded-xl font-grotesk font-semibold text-base transition-all duration-300 hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 mt-2"
                    style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)", boxShadow: "0 4px 20px hsl(186 79% 47% / 0.3)" }}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Devenir Futuriste →"}
                  </button>

                  <div className="flex items-center justify-center gap-6 pt-1">
                    <span className="text-xs flex items-center gap-1.5 text-white/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Gratuit
                    </span>
                    <span className="text-xs flex items-center gap-1.5 text-white/40">
                      <Clock className="w-3.5 h-3.5 text-primary" /> 2 min
                    </span>
                    <span className="text-xs flex items-center gap-1.5 text-white/40">
                      <Zap className="w-3.5 h-3.5 text-primary" /> Réponse 48h
                    </span>
                  </div>

                  <p className="text-center text-xs text-white/30">
                    En soumettant ce formulaire, vous acceptez d'être contacté·e par l'équipe futur proche.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── PHOTOS ── */}
        <section className="section-navy relative border-t" style={{ borderColor: "hsl(228 30% 15%)" }}>
          <div className="container mx-auto px-6 lg:px-12 py-14 md:py-18">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="group relative overflow-hidden rounded-2xl">
                <img src={membresFondateurs} alt="Les six membres fondateurs de futur proche" className="w-full object-cover aspect-[16/10] transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 text-xs font-mono uppercase tracking-wider text-white/70">L'équipe fondatrice</p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl">
                <img src={groupeAfterProche} alt="Photo de groupe lors d'un After Proche" className="w-full object-cover aspect-[16/10] transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 text-xs font-mono uppercase tracking-wider text-white/70">Un After Proche en images</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── RÉASSURANCE ── */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-16 md:py-20">
            <div className="text-center mb-12">
              <span className="section-label">— Pourquoi nous rejoindre</span>
              <h2 className="text-2xl md:text-3xl font-grotesk font-bold mt-3 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
                Ce qui vous attend{" "}
                <span className="font-serif-accent text-primary italic">à l'intérieur.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {reassurance.map((r) => (
                <div key={r.title} className="bg-white rounded-xl p-6 card-lift group" style={{ border: "1px solid hsl(228 10% 85%)" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "hsl(186 79% 47% / 0.1)" }}>
                    <r.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-grotesk font-semibold text-sm mb-1.5" style={{ color: "hsl(228 56% 10%)" }}>{r.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(228 15% 45%)" }}>{r.text}</p>
                </div>
              ))}
            </div>

            {/* Témoignage mobile */}
            <div className="lg:hidden max-w-2xl mx-auto rounded-2xl p-8 mt-12 text-center relative overflow-hidden" style={{ background: "hsl(228 56% 10%)" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
              <p className="font-serif-accent italic text-white/80 text-lg leading-relaxed mb-4">
                "En 3 mois chez futur proche, j'ai plus appris sur mon métier qu'en 2 ans de conférences. Les échanges sont d'une qualité rare."
              </p>
              <p className="text-xs font-mono uppercase tracking-wider text-primary">— CMO, Scale-up SaaS · Membre depuis 2024</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Candidater;
