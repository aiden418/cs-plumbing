"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";

const DEFAULT_PHOTOS: { src: string; caption?: string }[] = [
  { src: "/images/gallery/cs-plumbing-crew.jpg", caption: "Our crew on site" },
  { src: "/images/gallery/new-construction-roughin.jpg", caption: "New construction rough-in" },
  { src: "/images/gallery/kitchen-faucet-sink.jpg", caption: "Kitchen faucet install" },
  { src: "/images/gallery/tank-water-heater-replacement.jpg", caption: "Water heater replacement" },
  { src: "/images/gallery/underground-pipe-work.jpg", caption: "Underground pipe work" },
  { src: "/images/gallery/freestanding-soaking-tub.jpg", caption: "Freestanding tub install" },
];

interface Props {
  photos?: { src: string; caption?: string }[];
  serviceTitle?: string;
}

export default function JobGallery({ photos, serviceTitle }: Props) {
  const items = (photos && photos.length >= 3 ? photos : DEFAULT_PHOTOS).slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl mb-8 sm:mb-12">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2 sm:mb-3">
              Recent Work
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {serviceTitle ? `Real ${serviceTitle} jobs` : "Real jobs from our crews"}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500">
              Photos from actual C&S Plumbing jobs across Lee, Collier, and Charlotte
              counties. No stock images — this is what we do every day.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {items.map((p, i) => (
            <div
              key={`${p.src}-${i}`}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 group"
            >
              <Image
                src={p.src}
                alt={p.caption ?? `${serviceTitle ?? "Plumbing"} job photo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {p.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-xs text-white font-medium">{p.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
