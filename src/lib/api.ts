import { AboutInfo } from '@/types/api';

// Mock data until Supabase is connected
export const fetchFeatures = async () => {
  return [
    {
      id: "1",
      title: "Idea Organization",
      description: "Organize your ideas with tags, categories, and custom fields",
      iconUrl: "/icons/organize.svg",
      moreInfoLink: "/features#organization"
    },
    {
      id: "2",
      title: "Collaboration",
      description: "Share and collaborate on ideas with team members",
      iconUrl: "/icons/collaborate.svg",
      moreInfoLink: "/features#collaboration"
    },
    {
      id: "3",
      title: "Smart Search",
      description: "Quickly find ideas with powerful search capabilities",
      iconUrl: "/icons/search.svg",
      moreInfoLink: "/features#search"
    }
  ];
};

export const fetchCommunityInfo = async () => {
  return [
    {
      id: "1",
      groupName: "Entrepreneurs",
      description: "Connect with fellow entrepreneurs",
      linkToJoin: "/community/entrepreneurs"
    },
    {
      id: "2",
      groupName: "Developers",
      description: "Share technical ideas and get feedback",
      linkToJoin: "/community/developers"
    }
  ];
};

export const fetchPricingPlans = async () => {
  return [
    {
      id: "1",
      planName: "Free",
      price: 0,
      billingCycle: "monthly" as const,
      featuresIncluded: [
        "Up to 50 ideas",
        "Basic organization",
        "Community access"
      ],
      signUpLink: "/signup/free"
    },
    {
      id: "2",
      planName: "Pro",
      price: 9.99,
      billingCycle: "monthly" as const,
      featuresIncluded: [
        "Unlimited ideas",
        "Advanced organization",
        "Priority support",
        "Collaboration features"
      ],
      signUpLink: "/signup/pro"
    }
  ];
};

export const fetchAboutInfo = async (): Promise<AboutInfo> => {
  return {
    missionStatement: "Our mission is to help people capture and organize their ideas effectively.",
    teamMembers: [
      {
        name: "John Doe",
        role: "CEO",
        bio: "Passionate about helping people organize their ideas.",
        photoUrl: "/placeholder.svg"
      },
      {
        name: "Jane Smith",
        role: "CTO",
        bio: "Technical expert with a vision for innovation.",
        photoUrl: "/placeholder.svg"
      }
    ],
    companyHistory: [
      { date: "2023", event: "Company Founded" },
      { date: "2024", event: "Launch of IdeaVault Platform" }
    ],
    contactLinks: {
      email: "contact@ideavault.com",
      socialMedia: [
        { platform: "Twitter", url: "https://twitter.com/ideavault" },
        { platform: "LinkedIn", url: "https://linkedin.com/company/ideavault" }
      ]
    }
  };
};