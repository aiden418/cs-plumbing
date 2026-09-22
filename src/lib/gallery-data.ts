import type { GalleryItem } from "./types";

/**
 * The /gallery grid. Lives outside the client component so the sitemap can
 * list every photo (image sitemap) without pulling a "use client" module
 * into server code — client-module exports arrive there as references, not
 * values. Ingest new photos with `npm run gallery:ingest` and paste the
 * generated block below; ids continue from the highest one here.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  // Drone / Aerial
  { id: "1", src: "/images/gallery/aerial-underground-layout.jpg", alt: "Aerial view of underground plumbing layout", category: "new-construction", title: "Aerial View — Underground Plumbing Layout" },
  { id: "2", src: "/images/gallery/aerial-waterfront-newbuild.jpg", alt: "Aerial view of waterfront new build", category: "new-construction", title: "Aerial View — Waterfront New Build" },

  // Remodel — Bathrooms & Fixtures
  { id: "3", src: "/images/gallery/freestanding-soaking-tub.jpg", alt: "Freestanding soaking tub", category: "remodel", title: "Freestanding Soaking Tub Install" },
  { id: "4", src: "/images/gallery/freestanding-tub-floor-filler.jpg", alt: "Freestanding tub with floor-mount filler", category: "remodel", title: "Freestanding Tub with Floor-Mount Filler" },
  { id: "5", src: "/images/gallery/freestanding-tub-accent-tile.jpg", alt: "Freestanding tub with accent tile", category: "remodel", title: "Freestanding Tub with Accent Tile" },
  { id: "6", src: "/images/gallery/soaking-tub-niche.jpg", alt: "Soaking tub in tiled niche", category: "remodel", title: "Soaking Tub Niche Installation" },
  { id: "7", src: "/images/gallery/double-vanity-bathroom.jpg", alt: "Double vanity bathroom remodel", category: "remodel", title: "Double Vanity Bathroom Remodel" },
  { id: "8", src: "/images/gallery/wall-mount-faucet-vanity.jpg", alt: "Wall-mount faucet vanity", category: "remodel", title: "Wall-Mount Faucet Vanity Install" },
  { id: "9", src: "/images/gallery/vessel-sink-vanity.jpg", alt: "Vessel sink vanity", category: "remodel", title: "Bathroom Vanity & Vessel Sink" },
  { id: "10", src: "/images/gallery/waterfront-kitchen-sink.jpg", alt: "Waterfront kitchen sink install", category: "remodel", title: "Waterfront Kitchen Sink Install" },
  { id: "11", src: "/images/gallery/dual-shower-head.jpg", alt: "Dual shower head installation", category: "remodel", title: "Dual Shower Head Installation" },
  { id: "12", src: "/images/gallery/multi-jet-body-spray-shower.jpg", alt: "Multi-jet body spray shower", category: "remodel", title: "Multi-Jet Body Spray Shower System" },
  { id: "13", src: "/images/gallery/rain-shower-handheld.jpg", alt: "Rain shower with handheld sprayer", category: "remodel", title: "Rain Shower with Handheld Sprayer" },
  { id: "14", src: "/images/gallery/rain-shower-handheld-marble.jpg", alt: "Rain shower and handheld on marble tile", category: "remodel", title: "Rain Shower & Handheld Install" },
  { id: "15", src: "/images/gallery/shower-slide-bar.jpg", alt: "Shower slide bar system", category: "remodel", title: "Shower Slide Bar System" },
  { id: "16", src: "/images/gallery/dual-shower-system.jpg", alt: "Dual shower system", category: "remodel", title: "Dual Shower System Install" },
  { id: "17", src: "/images/gallery/modern-toilet-install.jpg", alt: "Modern toilet installation", category: "remodel", title: "Modern Toilet Installation" },
  { id: "18", src: "/images/gallery/toilet-install-tilework.jpg", alt: "Toilet install with tile work", category: "remodel", title: "Toilet Installation with Tile Work" },
  { id: "19", src: "/images/gallery/half-bath-pedestal-sink.jpg", alt: "Half bath pedestal sink", category: "remodel", title: "Half Bath Pedestal Sink & Toilet" },
  { id: "20", src: "/images/gallery/bathroom-toilet-install.jpg", alt: "Bathroom toilet installation", category: "remodel", title: "Bathroom Toilet Installation" },
  { id: "21", src: "/images/gallery/widespread-bathroom-faucet.jpg", alt: "Widespread bathroom faucet", category: "remodel", title: "Widespread Bathroom Faucet Install" },
  { id: "22", src: "/images/gallery/laundry-room-repipe.jpg", alt: "Laundry room repipe", category: "remodel", title: "Laundry Room Repipe" },
  { id: "23", src: "/images/gallery/new-construction-roughin.jpg", alt: "Remodel rough-in plumbing", category: "remodel", title: "Remodel Rough-In Plumbing" },
  { id: "24", src: "/images/gallery/attic-pex-repipe.jpg", alt: "Attic PEX water line repipe", category: "remodel", title: "Attic PEX Water Line Repipe" },

  // Commercial
  { id: "25", src: "/images/gallery/commercial-sink-install.jpg", alt: "Commercial sink installation", category: "commercial", title: "Commercial Sink Installation" },
  { id: "26", src: "/images/gallery/commercial-slab-excavation.jpg", alt: "Commercial slab plumbing excavation", category: "commercial", title: "Commercial Slab Plumbing Excavation" },
  { id: "27", src: "/images/gallery/commercial-plumbing-roughin.jpg", alt: "Commercial plumbing rough-in", category: "commercial", title: "Commercial Plumbing Rough-In" },
  { id: "28", src: "/images/gallery/commercial-prerinse-faucet.jpg", alt: "Commercial pre-rinse faucet", category: "commercial", title: "Commercial Pre-Rinse Faucet Install" },
  { id: "29", src: "/images/gallery/commercial-kitchen-sink-sprayer.jpg", alt: "Commercial kitchen sink and sprayer", category: "commercial", title: "Commercial Kitchen Sink & Sprayer" },
  { id: "30", src: "/images/gallery/commercial-restroom-sink.jpg", alt: "Commercial restroom sink", category: "commercial", title: "Commercial Restroom Sink Install" },
  { id: "31", src: "/images/gallery/commercial-toilet-install.jpg", alt: "Commercial toilet installation", category: "commercial", title: "Commercial Toilet Installation" },
  { id: "32", src: "/images/gallery/marina-water-pedestal.jpg", alt: "Marina water and power pedestal", category: "commercial", title: "Marina Water & Power Pedestal" },
  { id: "33", src: "/images/gallery/under-dock-plumbing.jpg", alt: "Under-dock plumbing work", category: "commercial", title: "Under-Dock Plumbing Work" },
  { id: "34", src: "/images/gallery/underground-water-tank.jpg", alt: "Underground water tank installation", category: "commercial", title: "Underground Water Tank Installation" },
  { id: "35", src: "/images/gallery/backflow-preventer-meter.jpg", alt: "Backflow preventer and meter assembly", category: "commercial", title: "Backflow Preventer & Meter Assembly" },
  { id: "36", src: "/images/gallery/exterior-hose-bib.jpg", alt: "Exterior hose bib installation", category: "commercial", title: "Exterior Hose Bib Installation" },
  { id: "64", src: "/images/gallery/prerinse-faucet-three-compartment-sink.jpg", alt: "Pre-rinse spray faucet installed at a commercial three-compartment sink", category: "commercial", title: "Pre-Rinse Faucet — Three-Compartment Sink" },

  // New Construction
  { id: "37", src: "/images/gallery/new-construction-underground.jpg", alt: "New construction underground plumbing", category: "new-construction", title: "New Construction Underground Plumbing" },
  { id: "38", src: "/images/gallery/underground-sewer-roughin.jpg", alt: "Underground sewer line rough-in", category: "new-construction", title: "Underground Sewer Line Rough-In" },
  { id: "39", src: "/images/gallery/foundation-plumbing-layout.jpg", alt: "Foundation plumbing layout", category: "new-construction", title: "Foundation Plumbing Layout" },
  { id: "40", src: "/images/gallery/drain-line-trenching.jpg", alt: "Drain line trenching", category: "new-construction", title: "Underground Drain Line Trenching" },
  { id: "41", src: "/images/gallery/copper-water-service.jpg", alt: "Copper water service assembly", category: "new-construction", title: "Copper Water Service Assembly" },
  { id: "42", src: "/images/gallery/new-construction-overhead-roughin.jpg", alt: "New construction overhead rough-in", category: "new-construction", title: "New Construction Overhead Rough-In" },
  { id: "43", src: "/images/gallery/new-construction-dwv-roughin.jpg", alt: "New construction DWV rough-in", category: "new-construction", title: "New Construction DWV Rough-In" },

  // Residential
  { id: "44", src: "/images/gallery/underground-pipe-work.jpg", alt: "Underground pipe installation", category: "residential", title: "Underground Pipe Work — Cape Coral" },
  { id: "45", src: "/images/gallery/tankless-water-heater.jpg", alt: "Tankless water heater installation", category: "residential", title: "Tankless Water Heater Installation" },
  { id: "46", src: "/images/gallery/rheem-water-heater.jpg", alt: "Rheem water heater installation", category: "residential", title: "Rheem Water Heater Installation" },
  { id: "47", src: "/images/gallery/electric-water-heater-closet.jpg", alt: "Electric water heater closet install", category: "residential", title: "Electric Water Heater Closet Install" },
  { id: "48", src: "/images/gallery/tank-water-heater-replacement.jpg", alt: "Tank water heater replacement", category: "residential", title: "Tank Water Heater Replacement" },
  { id: "49", src: "/images/gallery/water-filtration-system.jpg", alt: "Water filtration system install", category: "residential", title: "Water Filtration System Install" },
  { id: "50", src: "/images/gallery/pot-filler-faucet.jpg", alt: "Pot filler faucet installation", category: "residential", title: "Pot Filler Faucet Installation" },
  { id: "51", src: "/images/gallery/kitchen-faucet-sink.jpg", alt: "Kitchen faucet and sink install", category: "residential", title: "Kitchen Faucet & Sink Install" },
  { id: "52", src: "/images/gallery/under-sink-plumbing-disposal.jpg", alt: "Under-sink plumbing and disposal", category: "residential", title: "Under-Sink Plumbing & Disposal" },
  { id: "53", src: "/images/gallery/outdoor-shower-fixture.jpg", alt: "Outdoor shower fixture set", category: "residential", title: "Outdoor Shower Fixture Set" },
  { id: "54", src: "/images/gallery/grinder-pump-install.jpg", alt: "Grinder pump installation", category: "residential", title: "Grinder Pump Installation" },
  { id: "55", src: "/images/gallery/sewer-tap-connection.jpg", alt: "Sewer tap connection", category: "residential", title: "Sewer Tap Connection" },
  { id: "56", src: "/images/gallery/water-meter-connection.jpg", alt: "Water meter connection repair", category: "residential", title: "Water Meter Connection Repair" },
  { id: "57", src: "/images/gallery/residential-excavation.jpg", alt: "Residential excavation work", category: "residential", title: "Residential Excavation Work" },
  { id: "58", src: "/images/gallery/residential-sewer-excavation.jpg", alt: "Residential sewer line excavation", category: "residential", title: "Residential Sewer Line Excavation" },
  { id: "59", src: "/images/gallery/dock-drain-pipe.jpg", alt: "Dock drain pipe installation", category: "residential", title: "Dock Drain Pipe Installation" },
  { id: "60", src: "/images/gallery/dock-hose-reel.jpg", alt: "Dock hose reel and fish station", category: "residential", title: "Dock Hose Reel & Fish Station" },
  { id: "61", src: "/images/gallery/under-dock-water-line.jpg", alt: "Under-dock water line run", category: "residential", title: "Under-Dock Water Line Run" },
  { id: "62", src: "/images/gallery/cs-plumbing-crew.jpg", alt: "The C&S Plumbing crew", category: "residential", title: "The C&S Plumbing Crew" },
  { id: "63", src: "/images/gallery/team-excavator.jpg", alt: "Team at work with mini excavator", category: "residential", title: "Team at Work — Mini Excavator" },
];
