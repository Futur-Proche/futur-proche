import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useInViewReveal } from "@/hooks/useInViewReveal";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";
import { ClipboardList, Eye, Rocket, MessageSquare, Mic, Briefcase, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { ScrollyFormats } from "@/components/shared/ScrollyFormats";

import groupeAfterProcheImg from "@/assets/groupe-after-proche.jpg";
import whatsappMontageImg from "@/assets/whatsapp-montage.png";
import formatAfterworkImg from "@/assets/format-afterwork.jpg";
import formatPodcastImg from "@/assets/format-podcast.jpg";
import formatJobsImg from "@/assets/format-jobs.jpg";
import formatEtudesImg from "@/assets/format-etudes.jpg";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";

/* ───────────── DATA ───────────── */

const sujets = [
  "Comment mieux positionner mon Marketing auprès de mon ComEx ?",
  "Quel outil de recommandation pour mon site ?",
  "Comment gérer un retard de paiement sur une mission freelance ?",
  "Quelle agence PR pour parler de Tech en France ?",
  "Comment redéfinir les rôles dans mon équipe ?",
  "Quel CRM choisir pour un CAC40 vs une startup série B ?",
];

const formats = [
  {
    icon: MessageSquare,
    tag: "01",
    title: "After Proche & dîners",
    body: "Des afterworks et dîners chaque mois, des speakers haut niveau pour explorer nos problématiques clé ensemble. Paris, Lyon, Bordeaux, Toulouse, Nantes, Lille — et ça se développe.",
    image: formatAfterworkImg,
  },
  {
    icon: Mic,
    tag: "02",
    title: "Le podcast futur proche",
    body: "1 h de talk show mensuel pour challenger les a priori, entre leaders Marketing / Comm. 3 invités, 1 problématique terrain, animé par Dominique Trémouille.",
    image: formatPodcastImg,
  },
  {
    icon: Briefcase,
    tag: "03",
    title: "Jobs, missions et recommandations",
    body: "Recrutements, missions freelance, recommandations de prestataires et d'outils. Le bouche-à-oreille de 850+ leaders qui se font confiance.",
    image: formatJobsImg,
  },
  {
    icon: BarChart3,
    tag: "04",
    title: "Études et analyse terrain",
    body: "Étude de rémunération annuelle (800+ répondants), synthèses mensuelles, analyses terrain. Des données quali & quanti exclusives.",
    image: formatEtudesImg,
  },
];

const stats = [
  { label: "Expérience minimum", highlight: "7-8 ans", value: "7 à 8 ans en Marketing / Communication, salarié comme indépendant" },
  { label: "C-Level", highlight: "40 %", value: "CMO, VP Marketing, Directeurs Marketing & Communication" },
  { label: "Répartition", highlight: "4 univers", value: "PME/ETI, startups, grands groupes, indépendants et agences" },
  { label: "Secteurs", highlight: "10+", value: "B2B, B2C, Tech, Retail, Services, Industrie, Food, Pharma…" },
];

const steps = [
  {
    icon: ClipboardList,
    tag: "01",
    title: "Candidature",
    desc: "Un formulaire rapide (2 minutes). Parcours, poste actuel, motivation.",
    color: "hsl(186 79% 47%)",
  },
  {
    icon: Eye,
    tag: "02",
    title: "Review",
    desc: "L'équipe Onboarding examine chaque profil : expérience (7+ ans), poste en cours et passés, personnalité.",
    color: "hsl(45 100% 60%)",
  },
  {
    icon: Rocket,
    tag: "03",
    title: "Intégration",
    desc: "Accès à la communauté WhatsApp, séquence d'onboarding, présentation aux membres, invitation aux prochains événements.",
    color: "hsl(140 60% 50%)",
  },
];

/* ───────────── COMPONENT ───────────── */

const Communaute = () => {
  const hero = useInViewReveal<HTMLDivElement>(0.1);
  const sujetsReveal = useStaggeredReveal<HTMLDivElement>(sujets.length, 80, 0.15);
  const statsReveal = useStaggeredReveal<HTMLDivElement>(stats.length, 100, 0.2);
  const stepsReveal = useStaggeredReveal<HTMLDivElement>(steps.length, 180, 0.2);

  return (
    <>
      <Seo title={"Communauté Marketing / Comm — futur proche"} description={"Comment fonctionne notre communauté de 850+ leaders Marketing & Comm : formats, sujets, événements physiques et entraide entre pairs."} path={"/communaute"} />
      <Navbar />
      <main>
        {/* ── SECTION 1 — Hero ── */}
        <section className="section-navy relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
          <div className="dot-grid" />
          {/* Decorative orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-3xl pointer-events-none"
            style={{ background: "hsl(186 79% 47%)" }}
          />
          <div
            ref={hero.ref}
            className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl text-center transition-all duration-1000 ease-out"
            style={{
              opacity: hero.revealed ? 1 : 0,
              transform: hero.revealed ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <span className="section-label mb-4 inline-block">— La communauté</span>
            <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.15] mb-6">
              850+ leaders Marketing et Comm.{" "}
              <span className="font-serif-accent text-primary">
                Une seule communauté
              </span>{" "}
              pour trancher sur les sujets qui comptent.
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl mx-auto">
              futur proche rassemble les leaders du Marketing et de la Communication les plus engagés de France. Pas un annuaire, pas un réseau de plus. L'endroit où 800 pairs seniors se posent les vraies questions — et y répondent.
            </p>
          </div>
        </section>

        {/* ── Members Cloud — section à part ── */}
        <section className="relative overflow-hidden" style={{ background: "hsl(228 56% 10%)" }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(186 79% 47% / 0.4), transparent)" }} />
          <div className="container relative z-10 mx-auto px-6 lg:px-12 py-16 md:py-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-grotesk font-bold text-white tracking-tight">
                Ils sont déjà{" "}
                <span className="font-serif-accent text-primary">Futuristes.</span>
              </h2>
              <p className="text-sm text-white/40 mt-2 font-mono uppercase tracking-widest">
                850+ leaders Marketing / Comm
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, hsl(228 56% 10%), transparent)" }} />
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, hsl(228 56% 10%), transparent)" }} />
              <div className="overflow-hidden">
                <div className="flex gap-3 animate-[marquee_40s_linear_infinite] w-max">
                  <MembersCloudInline />
                  <MembersCloudInline />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(186 79% 47% / 0.2), transparent)" }} />
        </section>

        {/* ── SECTION 2 — Le quotidien + WhatsApp visual ── */}
        <section className="section-cream relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full opacity-[0.04] pointer-events-none" style={{ background: "hsl(186 79% 47%)" }} />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full opacity-[0.03] pointer-events-none" style={{ background: "hsl(228 56% 10%)" }} />

          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28 relative z-10">
            <div className="text-center mb-14">
              <span className="section-label">— Le quotidien chez futur proche</span>
              <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
                Ce qui se passe chaque semaine
              </h2>
              <div className="w-16 h-[3px] bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <div className="flex justify-center relative">
                <div className="absolute inset-0 blur-3xl opacity-20 rounded-full" style={{ background: "radial-gradient(circle, hsl(186 79% 47%), transparent 70%)" }} />
                <div className="relative w-full max-w-lg group">
                  <div
                    className="absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "linear-gradient(135deg, hsl(186 79% 47% / 0.15), transparent, hsl(186 79% 47% / 0.1))" }}
                  />
                  <img
                    src={whatsappMontageImg}
                    alt="Les groupes WhatsApp futur proche"
                    className="w-full relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-center leading-relaxed whitespace-nowrap font-mono" style={{ color: "hsl(228 15% 50%)" }}>
                  Groupes triés par thématique — on s'y retrouve facilement.
                </p>
              </div>

              <div>
                <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "hsl(228 15% 35%)" }}>
                  La communauté vit sur WhatsApp, tous les jours, toute l'année. Des centaines de messages par semaine. Des Futuristes qui partagent leurs arbitrages en cours, leurs doutes, leurs trouvailles, leurs idées. Des réponses concrètes, sourcées, sans détour.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  {[
                    { val: "500+", label: "messages / semaine" },
                    { val: "12", label: "groupes thématiques" },
                    { val: "8min", label: "délai de réponse moyen" },
                  ].map((s, i) => (
                    <div
                      key={s.label}
                      className="flex-1 min-w-[120px] rounded-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      style={{
                        background: "hsl(228 56% 10% / 0.06)",
                        border: "1px solid hsl(228 10% 85%)",
                        transitionDelay: `${i * 80}ms`,
                      }}
                    >
                      <span className="text-xl font-grotesk font-bold block" style={{ color: "hsl(186 60% 32%)" }}>{s.val}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "hsl(228 15% 50%)" }}>{s.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm leading-relaxed" style={{ color: "hsl(228 15% 45%)" }}>
                  Pas des discussions théoriques — des décisions qui se prennent, en live. Des réponses de pros qui ont déjà été confrontés au même choix, aux mêmes freins.
                </p>
              </div>
            </div>

            <h3 className="font-mono text-[11px] uppercase tracking-[1.5px] mb-5" style={{ color: "hsl(186 60% 32%)" }}>
              Exemples de sujets réels
            </h3>
            <div ref={sujetsReveal.ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sujets.map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 group transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40"
                  style={{
                    border: "1px solid hsl(228 10% 85%)",
                    opacity: sujetsReveal.revealed[i] ? 1 : 0,
                    transform: sujetsReveal.revealed[i] ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[1.2px] block mb-2 transition-colors duration-300 group-hover:text-primary" style={{ color: "hsl(186 60% 32%)" }}>
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed font-medium" style={{ color: "hsl(228 56% 10%)" }}>
                    {s}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3 — Les formats (scrollytelling Sadewa) ── */}
        <ScrollyFormats
          label="Les formats"
          heading="Une commu, plusieurs formats."
          steps={formats.map((f) => ({
            tag: f.tag,
            title: f.title,
            desc: f.body,
            image: f.image,
            icon: f.icon,
          }))}
          variant="navy"
        />

        {/* ── SECTION 4 — Profil des membres ── */}
        <section className="section-cream relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "hsl(186 79% 47%)" }} />
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28 relative z-10">
            <span className="section-label">— Qui sont les Futuristes ?</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold mt-3 mb-4 tracking-tight" style={{ color: "hsl(228 56% 10%)" }}>
              Le profil des membres
            </h2>
            <div className="w-16 h-[3px] bg-primary mb-3 rounded-full" />
            <p className="text-xs font-mono uppercase tracking-wider mb-8" style={{ color: "hsl(228 15% 50%)" }}>Survolez chaque carte</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
              <div>
                <p className="text-base md:text-lg leading-relaxed mb-10" style={{ color: "hsl(228 15% 35%)" }}>
                  Pas de profil type unique. Le Marketing est riche et diversifié, futur proche est un miroir de ça. Ce qui rassemble les Futuristes, c'est le niveau d'expérience et l'envie de la mettre au service des autres.
                </p>

                <div ref={statsReveal.ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ perspective: "1000px" }}>
                  {stats.map((s, i) => (
                    <FlipStatCard key={s.label} stat={s} active={statsReveal.revealed[i]} index={i} />
                  ))}
                </div>
              </div>

              <div className="flex items-center relative">
                <div className="relative rounded-2xl overflow-hidden w-full group">
                  <img
                    src={groupeAfterProcheImg}
                    alt="Groupe de Futuristes lors d'un After Proche"
                    className="w-full h-full object-cover max-h-[420px] transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, hsl(228 56% 10% / 0.85), transparent)" }}>
                    <p className="text-white font-grotesk font-semibold text-sm">After Proche — Paris</p>
                    <p className="text-white/50 text-xs font-mono">850+ leaders Marketing / Comm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-7 md:p-10 relative overflow-hidden transition-all duration-500 hover:shadow-xl" style={{ background: "hsl(228 56% 10%)" }}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: "hsl(186 79% 47%)" }} />
              <h3 className="text-lg font-grotesk font-semibold text-white mb-3 pl-4">Ce qui les rassemble</h3>
              <p className="text-sm md:text-base leading-relaxed text-white/70 max-w-3xl pl-4">
                La conviction que le Marketing est un métier de terrain, pas de théorie. Et que les meilleures décisions se prennent quand on peut les confronter à des pairs qui comprennent le contexte, qui sont déjà passés par là.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 5 — Comment devenir Futuriste ── */}
        <section className="section-navy relative overflow-hidden">
          <div className="dot-grid" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: "hsl(186 79% 47%)" }} />
          <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="section-label">Rejoindre</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-4 text-white">
              Comment devenir{" "}
              <span className="font-serif-accent text-primary">Futuriste</span> ?
            </h2>
            <p className="text-white/50 text-sm mb-12 max-w-2xl">
              Un process simple en 3 étapes. Candidature ouverte à tous les leaders Marketing / Comm avec 7+ ans d'expérience.
            </p>

            <div className="relative mb-12">
              {/* Animated connector line */}
              <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-[2px] overflow-hidden" style={{ background: "hsl(228 30% 22%)" }}>
                <div
                  className="h-full bg-primary transition-all duration-[1400ms] ease-out"
                  style={{ width: stepsReveal.revealed[steps.length - 1] ? "100%" : "0%" }}
                />
              </div>

              <div ref={stepsReveal.ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((s, i) => (
                  <div
                    key={s.tag}
                    className="relative group transition-all duration-700"
                    style={{
                      opacity: stepsReveal.revealed[i] ? 1 : 0,
                      transform: stepsReveal.revealed[i] ? "translateY(0)" : "translateY(24px)",
                    }}
                  >
                    <div className="flex justify-center mb-6">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[8deg]"
                        style={{
                          background: `${s.color}20`,
                          border: `2px solid ${s.color}`,
                          boxShadow: stepsReveal.revealed[i] ? `0 0 30px ${s.color}40` : "none",
                        }}
                      >
                        <s.icon size={22} style={{ color: s.color }} />
                      </div>
                    </div>

                    <div
                      className="rounded-xl p-7 text-center transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl"
                      style={{
                        background: "hsl(228 40% 14%)",
                        border: "1px solid hsl(228 30% 22%)",
                      }}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[1.2px] block mb-3" style={{ color: s.color }}>
                        Étape {s.tag}
                      </span>
                      <h3 className="text-lg font-grotesk font-semibold mb-3 text-white">{s.title}</h3>
                      <p className="text-sm leading-relaxed text-white/60">{s.desc}</p>
                    </div>

                    {i < steps.length - 1 && (
                      <div className="hidden md:flex absolute top-[52px] -right-4 z-20">
                        <ArrowRight size={16} className="text-white/20 group-hover:text-primary transition-colors duration-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Why selection — discreet */}
            <div className="mx-auto max-w-3xl rounded-lg px-5 py-4 md:px-6 md:py-5" style={{ background: "hsl(228 24% 14%)", border: "1px dashed hsl(228 25% 30%)" }}>
              <p className="text-xs md:text-sm leading-relaxed text-center md:text-left" style={{ color: "hsl(228 15% 70%)" }}>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider mr-2 text-primary">
                  <CheckCircle2 size={12} /> Pourquoi un process de sélection ?
                </span>
                <br className="hidden md:block" />
                Parce que la valeur de futur proche repose sur la qualité de chaque membre. On ne cherche pas à grossir sans boussole — on s'assure que la communauté gagne en valeur à chaque nouveau Futuriste.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 6 — CTA ── */}
        <section className="relative overflow-hidden gradient-mesh-bg">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-28 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white mb-8">
              Candidature en 2 minutes.{" "}
              <span className="font-serif-accent text-primary">Réponse sous 48 h.</span>
            </h2>
            <Link
              to="/candidater"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-grotesk font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_hsl(186_79%_47%_/_0.5)]"
              style={{ background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }}
            >
              Devenir Futuriste →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

/* ── Flip stat card ── */

const FlipStatCard = ({
  stat,
  active,
  index,
}: {
  stat: typeof stats[number];
  active: boolean;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative h-[160px] cursor-pointer transition-all duration-700"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 100}ms`,
        perspective: "1000px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((v) => !v)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: hovered ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white rounded-xl p-6 flex flex-col justify-between"
          style={{ border: "1px solid hsl(228 10% 85%)", backfaceVisibility: "hidden" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[1.5px]" style={{ color: "hsl(186 60% 32%)" }}>
            {stat.label}
          </span>
          <span className="text-3xl font-grotesk font-bold" style={{ color: "hsl(228 56% 10%)" }}>
            {stat.highlight}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider self-end" style={{ color: "hsl(228 15% 60%)" }}>
            ↻ détail
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl p-6 flex flex-col justify-center"
          style={{
            background: "hsl(228 56% 10%)",
            border: "1px solid hsl(186 79% 47% / 0.5)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 10px 40px hsl(186 79% 47% / 0.2)",
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary mb-2 block">
            {stat.label}
          </span>
          <p className="text-sm leading-relaxed text-white/85">{stat.value}</p>
        </div>
      </div>
    </div>
  );
};


/* ── Inline Members Cloud ── */

const MembersCloudInline = () => {
  const { data: members } = useQuery({
    queryKey: ["homepage-members"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, prenom, nom, photo_url")
        .limit(30);
      return data ?? [];
    },
  });

  const placeholders = Array.from({ length: 24 }, (_, i) => ({
    id: `ph-${i}`,
    prenom: ["A", "C", "E", "G", "I", "K", "M", "O", "Q", "S", "U", "W"][i % 12],
    nom: ["B", "D", "F", "H", "J", "L", "N", "P", "R", "T", "V", "X"][i % 12],
    photo_url: null as string | null,
  }));

  const displayMembers = members?.length ? members : placeholders;

  return (
    <div className="flex gap-3 flex-nowrap">
      {displayMembers.map((m) => (
        <div key={m.id} className="relative group flex-shrink-0">
          {m.photo_url ? (
            <img
              src={m.photo_url}
              alt={`${m.prenom} ${m.nom}`}
              className="w-12 h-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
              style={{ border: "2px solid hsl(228 30% 22%)" }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-mono font-medium transition-all duration-300 group-hover:border-primary"
              style={{
                border: "1px solid hsl(228 30% 22%)",
                background: "hsl(228 40% 16%)",
                color: "hsl(186 79% 47%)",
              }}
            >
              {m.prenom[0]}{m.nom[0]}
            </div>
          )}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[9px] px-2 py-0.5 rounded shadow text-[hsl(228_56%_10%)] font-medium z-10">
            {m.prenom} {m.nom}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Communaute;
