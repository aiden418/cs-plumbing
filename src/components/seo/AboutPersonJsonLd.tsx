export default function AboutPersonJsonLd() {
  const BASE = "https://www.csplumbinglee.com";

  const persons = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${BASE}/#owner`,
      name: "Samuel Pellechio Jr.",
      jobTitle: "Owner & President",
      url: `${BASE}/about`,
      image: `${BASE}/images/team/samuel.jpeg`,
      description:
        "First-generation licensed plumber and second-generation contractor leading C&S Plumbing of Lee since 1997. Licensed Florida Certified Plumbing Contractor (CFC1432485 / CFC057076) with decades of experience in residential, commercial, and new construction plumbing across Southwest Florida.",
      worksFor: {
        "@type": "Plumber",
        "@id": `${BASE}/#organization`,
        name: "C&S Plumbing of Lee",
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional License",
        name: "Certified Plumbing Contractor — CFC1432485",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Florida Department of Business and Professional Regulation",
          url: "https://www.myfloridalicense.com",
        },
      },
      knowsAbout: [
        "Residential Plumbing",
        "Commercial Plumbing",
        "New Construction Plumbing",
        "Whole-Home Repiping",
        "Water Heater Installation",
        "Florida Building Code Compliance",
        "Backflow Prevention",
        "Emergency Plumbing Repair",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${BASE}/#operations-manager`,
      name: "Aiden Pellechio",
      jobTitle: "Project Manager & Estimator",
      url: `${BASE}/about`,
      image: `${BASE}/images/team/aiden.jpg`,
      description:
        "Third-generation Pellechio working full-time as project manager and estimator at C&S Plumbing of Lee — also handling permitting and marketing — while earning a construction management degree at Florida Gulf Coast University (FGCU), Class of 2028, with plans to pursue his GC and plumbing licenses.",
      worksFor: {
        "@type": "Plumber",
        "@id": `${BASE}/#organization`,
        name: "C&S Plumbing of Lee",
      },
      knowsAbout: [
        "Construction Management",
        "Plumbing Operations",
        "Project Scheduling",
        "Customer Relations",
        "Business Operations",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Dylan Redecker",
      jobTitle: "Lead Plumber",
      url: `${BASE}/about`,
      image: `${BASE}/images/team/dylan.jpeg`,
      description:
        "Experienced lead plumber at C&S Plumbing of Lee, bringing hands-on expertise and dedication to every job site across Southwest Florida.",
      worksFor: {
        "@type": "Plumber",
        "@id": `${BASE}/#organization`,
        name: "C&S Plumbing of Lee",
      },
      knowsAbout: [
        "Residential Plumbing",
        "New Construction Plumbing",
        "Repiping",
        "Water Heater Installation",
        "Drain Cleaning",
      ],
    },
  ];

  return (
    <>
      {persons.map((person) => (
        <script
          key={person.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      ))}
    </>
  );
}
