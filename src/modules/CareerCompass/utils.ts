export interface HybridCareer {
  id: string;
  title: string;
  emoji: string;
  combination: string;
  howToCombine: string[];
  incomeStreams: string[];
  lifestyleBenefits: string[];
  examplePeople: { name: string; description: string }[];
}

export const mockHybridCareers: HybridCareer[] = [
  {
    id: "hc1",
    title: "Artist + Tech",
    emoji: "🎨+💻",
    combination: "Creative Technologist",
    howToCombine: [
      "Learn coding for interactive art",
      "Design user interfaces for creative apps",
      "Create digital installations",
    ],
    incomeStreams: [
      "Freelance design/development",
      "Art sales",
      "Workshop facilitation",
    ],
    lifestyleBenefits: [
      "High creative freedom",
      "Flexible work hours",
      "Impactful innovation",
    ],
    examplePeople: [
      { name: "Refik Anadol", description: "AI and data artist" },
      { name: "Zach Lieberman", description: "Artist, educator, programmer" },
    ],
  },
  {
    id: "hc2",
    title: "Travel + Work",
    emoji: "✈️+💼",
    combination: "Digital Nomad / Consultant",
    howToCombine: [
      "Offer consulting services remotely",
      "Create online courses",
      "Start a travel blog/vlog",
    ],
    incomeStreams: ["Consulting fees", "Course sales", "Affiliate marketing"],
    lifestyleBenefits: [
      "Location independence",
      "Cultural immersion",
      "Continuous learning",
    ],
    examplePeople: [
      { name: "Pieter Levels", description: "Founder of Nomad List" },
      {
        name: "Anja & Philipp",
        description: "Travel bloggers (Travel On Toast)",
      },
    ],
  },
  {
    id: "hc3",
    title: "Teacher + Creator",
    emoji: "🎓+📱",
    combination: "EdTech Content Creator",
    howToCombine: [
      "Develop educational apps",
      "Create engaging online courses",
      "Produce educational YouTube videos",
    ],
    incomeStreams: [
      "App/course sales",
      "YouTube ad revenue",
      "Brand sponsorships",
    ],
    lifestyleBenefits: [
      "Reach wider audience",
      "Flexible teaching methods",
      "High impact on learning",
    ],
    examplePeople: [
      { name: "Sal Khan", description: "Founder of Khan Academy" },
      {
        name: "Veritasium (Derek Muller)",
        description: "Science educator on YouTube",
      },
    ],
  },
];
