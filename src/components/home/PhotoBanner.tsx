import communityGroup from "@/assets/community-group.jpg";
import eventTalk from "@/assets/event-talk.jpg";
import eventCommunity from "@/assets/event-community.jpg";

export const PhotoBanner = () => (
  <section className="section-navy">
    <div className="container mx-auto px-6 lg:px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <figure>
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img src={communityGroup} alt="Communauté futur proche rassemblée" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[1.2px] text-white/40">La communauté réunie lors d'un After Proche</figcaption>
        </figure>
        <figure>
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img src={eventTalk} alt="Conférence After Proche" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[1.2px] text-white/40">Speakers & tables rondes entre pairs</figcaption>
        </figure>
        <figure>
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img src={eventCommunity} alt="Événement communauté" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[1.2px] text-white/40">Networking et échanges informels</figcaption>
        </figure>
      </div>
    </div>
  </section>
);
