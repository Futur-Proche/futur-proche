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
      {/* 1. Navy — Hero */}
      <HeroSection />
      {/* 2. Cream — Constat */}
      <TensionSection />
      {/* 3. Navy — Stats */}
      <KeyElementsSection />
      {/* 4. Cream — Formats */}
      <FormatsSection />
      {/* 5. Navy — Photos */}
      <PhotoBanner />
      {/* 6. Cream — Testimonials */}
      <TestimonialsSection />
      {/* 7. Navy — Pour qui */}
      <ForYouSection />
      {/* 8. Cream — Members */}
      <MembersCloud />
      {/* 9. Navy — Join */}
      <JoinSection />
      {/* 10. Mesh gradient — CTA */}
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
