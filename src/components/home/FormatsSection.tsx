import communityGroup from "@/assets/community-group.jpg";
import eventTalk from "@/assets/event-talk.jpg";
import networkingEchanges from "@/assets/networking-echanges.jpg";
import ambianceGroupe from "@/assets/ambiance-groupe.jpg";
import { ScrollyFormats } from "@/components/shared/ScrollyFormats";

const formats = [
  {
    tag: "01_WhatsApp",
    title: "Échanges quotidiens",
    desc: "Un fil vivant où l'on partage les vrais arbitrages : choix d'outil, négociation d'agence, recadrage d'équipe. Pas de posture, pas de pitch — juste des pairs qui répondent vite et bien.",
    image: communityGroup,
    cta: { label: "Découvrir la communauté", href: "/communaute" },
  },
  {
    tag: "02_Events",
    title: "Événements exclusifs",
    desc: "Des rencontres physiques resserrées (40-80 personnes) où l'on parle vraiment. Format speaker + tables rondes + apéro long. Pas de stand, pas de goodies.",
    image: eventTalk,
    cta: { label: "Voir les événements", href: "/evenements" },
  },
  {
    tag: "03_Ressources",
    title: "Des ressources expertes",
    desc: "Podcast, études sectorielles, frameworks, retours d'expérience : des contenus produits avec et pour les Futuristes, qui ne se trouvent pas ailleurs.",
    image: networkingEchanges,
    cta: { label: "Accéder aux ressources", href: "/ressources" },
  },
  {
    tag: "04_Carte",
    title: "Des opportunités partout en France",
    desc: "Une cartographie vivante des leaders Marketing / Comm membres : Paris, Lyon, Bordeaux, Nantes, Lille et au-delà. Voyez où sont les pairs proches de chez vous.",
    image: ambianceGroupe,
    cta: { label: "Explorer la carte", href: "/carte" },
  },
];

export const FormatsSection = () => (
  <ScrollyFormats
    label="Une commu, plusieurs formats"
    heading="Ce qui se passe à l'intérieur."
    intro="Quatre canaux complémentaires pour des Futuristes connectés au quotidien et aux moments forts."
    steps={formats}
    variant="cream"
  />
);
