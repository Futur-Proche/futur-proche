import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TensionSection } from "@/components/home/TensionSection";
import { KeyElementsSection } from "@/components/home/KeyElementsSection";
import { FormatsSection } from "@/components/home/FormatsSection";
import { PhotoBanner } from "@/components/home/PhotoBanner";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ForYouSection } from "@/components/home/ForYouSection";
import { MembersCloud } from "@/components/home/MembersCloud";
import { JoinSection } from "@/components/home/JoinSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => (
  <>
    <Navbar />
    <main>
      {/* Navy */}
      <HeroSection />
      {/* Cream */}
      <TensionSection />
      {/* Navy - Stats */}
      <KeyElementsSection />
      {/* Navy - Formats (cards halo) */}
      <FormatsSection />
      {/* Navy - Photos */}
      <PhotoBanner />
      {/* Cream - Testimonials */}
      <TestimonialsSection />
      {/* Navy - Pour qui */}
      <ForYouSection />
      {/* Cream - Members */}
      <MembersCloud />
      {/* Navy - Join + image */}
      <JoinSection />
      {/* Mesh gradient CTA */}
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
