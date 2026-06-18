import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Mail, Loader2 } from "lucide-react";

interface Props {
  event: any;
  isUserRegistered: boolean;
  registrationsCount: number;
}

export const RegistrationBlock = ({ event, isUserRegistered, registrationsCount }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [poste, setPoste] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailIsMember, setEmailIsMember] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const price = Number(event.prix ?? 0);
  const isFree = !price || price <= 0;
  const capacityReached = event.capacite && registrationsCount >= event.capacite;
  const registrationsClosed = !!event.registrations_closed;

  const checkEmail = async () => {
    if (!email) return;
    setEmailCheckLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-member-email", {
        body: { email },
      });
      if (error) throw error;
      setEmailIsMember(!!data?.is_member);
      if (data?.prenom) setPrenom(data.prenom);
      if (data?.nom) setNom(data.nom);
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setEmailCheckLoading(false);
    }
  };

  const handleRegister = async () => {
    setSubmitting(true);
    try {
      const body: any = { event_id: event.id };
      if (!user) {
        body.guest_email = email;
        body.guest_prenom = prenom;
        body.guest_nom = nom;
        body.guest_poste = poste;
        body.guest_entreprise = entreprise;
      }
      const { data, error } = await supabase.functions.invoke("create-event-checkout", { body });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      if (data?.free || data?.registered) {
        navigate(`/evenements/${event.slug ?? event.id}/success`);
        return;
      }
      if (data?.already_registered) {
        toast({ title: "Vous êtes déjà inscrit·e." });
        return;
      }
      if (data?.error) {
        toast({ title: "Inscription impossible", description: data.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Already registered
  if (isUserRegistered) {
    return (
      <div className="rounded-2xl p-6" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(186 79% 47% / 0.4)" }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider">Inscription confirmée</span>
        </div>
        <h3 className="text-lg font-grotesk font-bold text-white mb-1">Vous y êtes</h3>
        <p className="text-white/60 text-sm">Rendez-vous le {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.</p>
      </div>
    );
  }

  // Registrations closed or capacity reached
  if (registrationsClosed || capacityReached) {
    return (
      <div className="rounded-2xl p-6" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
        <p className="font-mono text-[11px] uppercase tracking-wider text-white/40 mb-2">
          {registrationsClosed ? "Inscriptions fermées" : "Complet"}
        </p>
        <h3 className="text-lg font-grotesk font-bold text-white mb-1">
          {registrationsClosed ? "Les inscriptions sont closes" : "Capacité atteinte"}
        </h3>
        <p className="text-white/60 text-sm">
          {registrationsClosed
            ? "L'organisateur a fermé les inscriptions pour cet événement."
            : "Cet événement affiche complet."}
        </p>
        <p className="text-white/40 text-xs mt-3 font-mono">{registrationsCount} inscrit{registrationsCount > 1 ? "s" : ""}</p>
      </div>
    );
  }

  const priceLabel = isFree ? "Gratuit" : `${price.toFixed(0)} €`;
  const ctaLabel = isFree ? "S'inscrire" : `Payer ${priceLabel}`;

  // Member connected → direct CTA
  if (user) {
    return (
      <div className="rounded-2xl p-6 sticky top-24" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
        <p className="font-mono text-[11px] uppercase tracking-wider text-primary mb-2">Inscription</p>
        <p className="text-3xl font-grotesk font-bold text-white mb-4">{priceLabel}</p>
        <button
          onClick={handleRegister}
          disabled={submitting}
          className="w-full px-5 py-3 rounded-lg font-grotesk font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {ctaLabel} →
        </button>
        {event.capacite && (
          <p className="text-xs text-white/40 mt-3 text-center">
            {Math.max(0, event.capacite - registrationsCount)} places restantes
          </p>
        )}
      </div>
    );
  }

  // Visitor + open to all → guest form
  if (event.is_open_to_all) {
    return (
      <div className="rounded-2xl p-6 sticky top-24" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
        <p className="font-mono text-[11px] uppercase tracking-wider text-primary mb-2">Ouvert à tous</p>
        <p className="text-3xl font-grotesk font-bold text-white mb-4">{priceLabel}</p>
        <div className="space-y-2 mb-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
            style={{ background: "hsl(228 40% 10%)", border: "1px solid hsl(228 30% 25%)" }} />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm text-white outline-none"
              style={{ background: "hsl(228 40% 10%)", border: "1px solid hsl(228 30% 25%)" }} />
            <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm text-white outline-none"
              style={{ background: "hsl(228 40% 10%)", border: "1px solid hsl(228 30% 25%)" }} />
          </div>
        </div>
        <button
          onClick={handleRegister}
          disabled={submitting || !email || !prenom || !nom}
          className="w-full px-5 py-3 rounded-lg font-grotesk font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {ctaLabel} →
        </button>
      </div>
    );
  }

  // Visitor + members-only → blocked + email check fallback
  return (
    <div className="rounded-2xl p-6 sticky top-24" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
      <div className="flex items-center gap-2 text-white/50 mb-3">
        <Lock className="w-4 h-4" />
        <span className="font-mono text-[11px] uppercase tracking-wider">Réservé à la communauté</span>
      </div>
      <h3 className="text-lg font-grotesk font-bold text-white mb-2">Cet événement est ouvert aux Futuristes</h3>
      <p className="text-white/60 text-sm mb-4">
        Pour participer, postulez d'abord à la communauté.
      </p>
      <Link
        to="/candidater"
        className="block text-center w-full px-5 py-3 rounded-lg font-grotesk font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity mb-5"
      >
        Devenir Futuriste →
      </Link>

      <div className="border-t pt-4" style={{ borderColor: "hsl(228 30% 22%)" }}>
        <p className="text-xs text-white/50 mb-2 flex items-center gap-1.5">
          <Mail className="w-3 h-3" /> Déjà membre ? Renseignez votre email
        </p>
        <div className="flex gap-2">
          <input type="email" placeholder="vous@exemple.com" value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailIsMember(null); }}
            className="flex-1 rounded-lg px-3 py-2 text-sm text-white outline-none"
            style={{ background: "hsl(228 40% 10%)", border: "1px solid hsl(228 30% 25%)" }} />
          <button
            onClick={checkEmail}
            disabled={!email || emailCheckLoading}
            className="px-3 py-2 rounded-lg text-xs font-grotesk text-white/70 hover:text-white"
            style={{ border: "1px solid hsl(228 30% 25%)" }}
          >
            {emailCheckLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Vérifier"}
          </button>
        </div>
        {emailIsMember === false && (
          <p className="text-xs text-red-400/80 mt-2">Email non reconnu. Postulez à la communauté.</p>
        )}
        {emailIsMember === true && (
          <>
            <p className="text-xs text-emerald-400 mt-2">✓ Membre reconnu — {prenom} {nom}</p>
            <button
              onClick={handleRegister}
              disabled={submitting}
              className="mt-3 w-full px-5 py-3 rounded-lg font-grotesk font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {ctaLabel} →
            </button>
          </>
        )}
      </div>
    </div>
  );
};
