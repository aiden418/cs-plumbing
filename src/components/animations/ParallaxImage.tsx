"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { registerGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  priority?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className = "",
  priority = false,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();

    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const distance = speed * 100;

    gsap.set(image, { y: -distance });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(image, {
          y: -distance + self.progress * distance * 2,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
    >
      <div ref={imageRef} className="relative w-full h-[120%]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
        />
      </div>
    </div>
  );
}
