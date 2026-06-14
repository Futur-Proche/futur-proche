import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TensionSection } from "@/components/home/TensionSection";
import { VideoSection } from "@/components/home/VideoSection";
import { KeyElementsSection } from "@/components/home/KeyElementsSection";
import { FormatsSection } from "@/components/home/FormatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ForYouSection } from "@/components/home/ForYouSection";
import { MembersCloud } from "@/components/home/MembersCloud";
import { JoinSection } from "@/components/home/JoinSection";
import { CTASection } from "@/components/home/CTASection";
import { EventsTeaserSection } from "@/components/home/EventsTeaserSection";
import { RessourcesTeaserSection } from "@/components/home/RessourcesTeaserSection";
import { EventsPhotoCarousel } from "@/components/shared/EventsPhotoCarousel";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <TensionSection />
      <VideoSection />
      {/* Carrousel vie de la communauté (dynamique, photos d'événements) */}
      <EventsPhotoCarousel
        variant="marquee"
        label="La vie de la communauté"
        heading="Ce qui s'est passé récemment."
        intro="Photos des derniers After Proche et dîners — entre Futuristes."
        surface="cream"
        limit={3}
        perEvent={8}
      />
      <KeyElementsSection />
      <FormatsSection />
      {/* Bloc groupé : Événements + Ressources (même background cream) */}
      <EventsTeaserSection />
      <RessourcesTeaserSection />
      <ForYouSection />
      <TestimonialsSection />
      <MembersCloud />
      <JoinSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
