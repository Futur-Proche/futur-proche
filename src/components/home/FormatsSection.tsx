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
  },
  {
    tag: "02_Events",
    title: "After Proche",
    desc: "Des rencontres physiques resserrées (40-80 personnes) où l'on parle vraiment. Format speaker + tables rondes + apéro long. Pas de stand, pas de goodies.",
    image: eventTalk,
  },
  {
    tag: "03_Podcast",
    title: "Conversations sans filtre",
    desc: "Des épisodes longs avec des leaders Marketing / Comm qui acceptent de raconter leurs vraies décisions — celles qui ont marché, celles qui ont raté, et ce qu'ils en retiennent.",
    image: formatPodcast,
  },
  {
    tag: "04_Jobs",
    title: "Opportunités",
    desc: "Postes, freelances, mandats d'advisory — circulés en circuit fermé. Les meilleures opportunités ne passent jamais par LinkedIn ; elles passent ici.",
    image: formatJobs,
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
