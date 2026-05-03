import communityGroup from "@/assets/community-group.jpg";
import eventTalk from "@/assets/event-talk.jpg";
import eventCommunity from "@/assets/event-community.jpg";

export const PhotoBanner = () => (
  <section className="section-navy">
    <div className="container mx-auto px-6 lg:px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="aspect-[4/3] rounded-lg overflow-hidden">
          <img src={communityGroup} alt="Communauté futur proche rassemblée" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden">
          <img src={eventTalk} alt="Conférence After Proche" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden">
          <img src={eventCommunity} alt="Événement communauté" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
);
