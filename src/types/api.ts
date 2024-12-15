export interface Feature {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  moreInfoLink: string;
}

export interface CommunityGroup {
  id: string;
  groupName: string;
  description: string;
  linkToJoin: string;
}

export interface PricingPlan {
  id: string;
  planName: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  featuresIncluded: string[];
  signUpLink: string;
}

export interface AboutInfo {
  missionStatement: string;
  teamMembers: {
    name: string;
    role: string;
    bio: string;
    photoUrl: string;
  }[];
  companyHistory: {
    date: string;
    event: string;
  }[];
  contactLinks: {
    email: string;
    socialMedia: {
      platform: string;
      url: string;
    }[];
  };
}