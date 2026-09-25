export interface TypeBeat {
  id: string;
  title: string;
  producer: string;
  bpm: number;
  scale: string;
  tags: string[];
  duration: string;
  isPremium: boolean;
  synthStyle: 'travis' | 'drake' | 'metro';
  cover?: string;
  audioUrl?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  handle: string;
  text: string;
  avatarUrl: string;
  rating: number;
  date: string;
  likes: number;
}

export interface Bonus {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  iconName: string;
  cover?: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface PlanBenefit {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  popular: boolean;
  benefits: (string | PlanBenefit)[];
  ctaText: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

