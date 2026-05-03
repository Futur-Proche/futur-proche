import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const posteOptions = [
  "Dir. Marketing / Com ou assimilé",
  "VP Marketing / Com ou assimilé",
  "CMO ou assimilé",
  "Head of Marketing / Com ou assimilé",
  "Responsable Marketing / Comm ou assimilé",
  "Expert(e) Senior (copywriting, ads, SEA, SEO etc.)",
  "Autre",
];

const secteurOptions = [
  "Si indépendant(e), ne rien indiquer",
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
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Candidature envoyée !",
        description: "Nous reviendrons vers vous sous 48h.",
      });
      setForm({
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
    }

    setIsSubmitting(false);
  };

  const inputClass =
    "w-full rounded-lg border px-4 py-3 text-sm font-grotesk outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white";
  const labelClass = "block text-sm font-grotesk font-medium mb-1.5";
  const requiredBadge = (
    <span className="text-xs font-normal ml-1" style={{ color: "hsl(228 15% 55%)" }}>
      (obligatoire)
    </span>
  );

  return (
    <>
      <Navbar />
      <main>
        <section className="section-navy relative overflow-hidden">
          <div className="orb orb--cyan w-[400px] h-[400px] top-[-10%] right-[10%]" />
          <div className="dot-grid" />
          <div className="grain-overlay" />

          <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-32 pb-16 md:pt-40 md:pb-20">
            <span className="section-label">— Rejoindre</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-grotesk font-bold tracking-tight text-white mt-3 mb-3">
              Candidater à{" "}
              <span className="font-serif-accent text-primary italic">futur proche.</span>
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-xl leading-relaxed">
              Remplissez le formulaire ci-dessous. Chaque profil est examiné par notre équipe pour garantir la qualité des échanges.
            </p>
          </div>
        </section>

        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-16 md:py-20">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              {/* Prénom & Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prenom" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                    Prénom{requiredBadge}
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={form.prenom}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ borderColor: "hsl(228 10% 80%)", color: "hsl(228 56% 10%)" }}
                  />
                </div>
                <div>
                  <label htmlFor="nom" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                    Nom de famille{requiredBadge}
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={form.nom}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ borderColor: "hsl(228 10% 80%)", color: "hsl(228 56% 10%)" }}
                  />
                </div>
              </div>

              {/* Poste */}
              <div>
                <label htmlFor="poste" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                  Poste{requiredBadge}
                </label>
                <select
                  id="poste"
                  name="poste"
                  required
                  value={form.poste}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ borderColor: "hsl(228 10% 80%)", color: form.poste ? "hsl(228 56% 10%)" : "hsl(228 15% 55%)" }}
                >
                  <option value="" disabled>
                    Quel job exercez-vous ? (indé ou salarié(e))
                  </option>
                  {posteOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entreprise */}
              <div>
                <label htmlFor="entreprise" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                  Entreprise{requiredBadge}
                </label>
                <input
                  id="entreprise"
                  name="entreprise"
                  type="text"
                  required
                  value={form.entreprise}
                  onChange={handleChange}
                  placeholder="Si indépendant(e), ne rien indiquer"
                  className={inputClass}
                  style={{ borderColor: "hsl(228 10% 80%)", color: "hsl(228 56% 10%)" }}
                />
              </div>

              {/* Secteur */}
              <div>
                <label htmlFor="secteur" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                  Secteur / Industrie{requiredBadge}
                </label>
                <select
                  id="secteur"
                  name="secteur"
                  required
                  value={form.secteur}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ borderColor: "hsl(228 10% 80%)", color: form.secteur ? "hsl(228 56% 10%)" : "hsl(228 15% 55%)" }}
                >
                  <option value="" disabled>
                    Choisissez une option
                  </option>
                  {secteurOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                  E-mail{requiredBadge}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ borderColor: "hsl(228 10% 80%)", color: "hsl(228 56% 10%)" }}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="telephone" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                  Téléphone{requiredBadge}
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="Pour intégrer la communauté"
                  className={inputClass}
                  style={{ borderColor: "hsl(228 10% 80%)", color: "hsl(228 56% 10%)" }}
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label htmlFor="linkedin" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                  Profil LinkedIn
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className={inputClass}
                  style={{ borderColor: "hsl(228 10% 80%)", color: "hsl(228 56% 10%)" }}
                />
              </div>

              {/* Cooptation */}
              <div>
                <label htmlFor="cooptation" className={labelClass} style={{ color: "hsl(228 56% 10%)" }}>
                  Êtes-vous coopté(e) par un membre ?
                </label>
                <input
                  id="cooptation"
                  name="cooptation"
                  type="text"
                  value={form.cooptation}
                  onChange={handleChange}
                  placeholder="Nom du membre (facultatif)"
                  className={inputClass}
                  style={{ borderColor: "hsl(228 10% 80%)", color: "hsl(228 56% 10%)" }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground px-7 py-4 rounded-lg font-grotesk font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Envoi en cours..." : "Je veux rejoindre la Commu →"}
              </button>

              <p className="text-center text-xs mt-4" style={{ color: "hsl(228 15% 55%)" }}>
                En soumettant ce formulaire, vous acceptez d'être contacté(e) par l'équipe futur proche.
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Candidater;
