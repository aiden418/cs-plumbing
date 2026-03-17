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
        "Second-generation master plumber leading C&S Plumbing of Lee County. Licensed Florida Certified Plumbing Contractor (CFC1432485) with decades of experience in residential, commercial, and new construction plumbing across Southwest Florida.",
      worksFor: {
        "@type": "Plumber",
        "@id": `${BASE}/#organization`,
        name: "C&S Plumbing of Lee County",
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
      jobTitle: "Operations Manager",
      url: `${BASE}/about`,
      image: `${BASE}/images/team/aiden.jpg`,
      description:
        "Third-generation family member managing daily operations at C&S Plumbing of Lee County. Construction management graduate from Florida Gulf Coast University (FGCU) bringing modern business practices to a family plumbing tradition.",
      worksFor: {
        "@type": "Plumber",
        "@id": `${BASE}/#organization`,
        name: "C&S Plumbing of Lee County",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Florida Gulf Coast University",
        url: "https://www.fgcu.edu",
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
        "Experienced lead plumber at C&S Plumbing of Lee County, bringing hands-on expertise and dedication to every job site across Southwest Florida.",
      worksFor: {
        "@type": "Plumber",
        "@id": `${BASE}/#organization`,
        name: "C&S Plumbing of Lee County",
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
