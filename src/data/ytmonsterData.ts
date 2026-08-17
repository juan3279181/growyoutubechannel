import { CreditPackage, MembershipPlan, ExpressService, ExchangeVideo, Campaign } from '../types';

export const PAYMENT_CONFIG = {
  paypalEmail: 'juan8191327@gmail.com',
  btcAddress: 'bc1q7vh7mkrrt3vuzlup6z29ky8asqxfz08vclvyve',
  btcRateUsd: 94800, // 1 BTC in USD for satoshi calculation
};

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter-10k',
    credits: 10000,
    priceUsd: 10.00,
    bonusCredits: 1000,
    tagline: 'Ideal for small channel kickstart',
  },
  {
    id: 'growth-50k',
    credits: 50000,
    priceUsd: 40.00,
    bonusCredits: 7500,
    popular: true,
    tagline: 'Most popular for consistent video ranking',
  },
  {
    id: 'viral-150k',
    credits: 150000,
    priceUsd: 99.00,
    bonusCredits: 30000,
    tagline: 'High volume for viral video pushes',
  },
  {
    id: 'influencer-500k',
    credits: 500000,
    priceUsd: 280.00,
    bonusCredits: 150000,
    bestValue: true,
    tagline: 'Enterprise scaling & massive watch hours',
  },
  {
    id: 'titan-1m',
    credits: 1000000,
    priceUsd: 499.00,
    bonusCredits: 400000,
    tagline: 'Complete channel monetization acceleration',
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'free',
    name: 'Free Member',
    priceUsdMonthly: 0,
    dailyCredits: 100,
    activeCampaignSlots: 3,
    earningMultiplier: 1.0,
    prioritySupport: false,
    customPacing: false,
    features: [
      'Access to Client Exchanger',
      '3 Active Campaign Slots',
      'Standard Delivery Speed',
      'Community Forum Access',
      '100 Daily Bonus Credits'
    ]
  },
  {
    id: 'lite',
    name: 'Lite Booster',
    priceUsdMonthly: 6.99,
    dailyCredits: 500,
    activeCampaignSlots: 8,
    earningMultiplier: 1.25,
    prioritySupport: false,
    customPacing: true,
    features: [
      '+25% Faster Credit Earning',
      '8 Active Campaign Slots',
      '500 Daily Bonus Credits',
      'Custom Delivery Pacing (Views/Hour)',
      'Geo-Targeting Filters'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Member',
    priceUsdMonthly: 19.99,
    dailyCredits: 1500,
    activeCampaignSlots: 20,
    earningMultiplier: 1.75,
    prioritySupport: true,
    customPacing: true,
    popular: true,
    features: [
      '+75% Faster Credit Earning',
      '20 Active Campaign Slots',
      '1,500 Daily Bonus Credits',
      'High-Retention View Algorithm',
      'Multi-Session Client Running (3 tabs)',
      'Priority Ticket Support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro VIP Elite',
    priceUsdMonthly: 29.99,
    dailyCredits: 3500,
    activeCampaignSlots: 50,
    earningMultiplier: 2.5,
    prioritySupport: true,
    customPacing: true,
    features: [
      '+150% Turbo Credit Earning',
      '50 Active Campaign Slots',
      '3,500 Daily Bonus Credits',
      'Unlimited Multi-Session Boosters',
      'Dedicated Account Manager & 24/7 VIP Chat',
      'Zero Campaign Service Fees'
    ]
  }
];

export const EXPRESS_SERVICES: ExpressService[] = [
  {
    id: 'exp-views-1k',
    serviceType: 'views',
    title: '1,000 High-Retention Views',
    amount: 1000,
    priceUsd: 7.99,
    deliveryTime: '6-12 Hours',
    retention: '60-180 Seconds',
    features: ['100% Real Viewers', 'High Watch-Time', 'Monetization Safe', 'Natural Gradual Drip']
  },
  {
    id: 'exp-views-5k',
    serviceType: 'views',
    title: '5,000 High-Retention Views',
    amount: 5000,
    priceUsd: 29.99,
    deliveryTime: '12-24 Hours',
    retention: '90-240 Seconds',
    features: ['Boost Search Ranking', 'High Watch-Time', 'Monetization Safe', 'Natural Gradual Drip']
  },
  {
    id: 'exp-subs-250',
    serviceType: 'subscribers',
    title: '250 Real YouTube Subscribers',
    amount: 250,
    priceUsd: 18.50,
    deliveryTime: '24-48 Hours',
    retention: 'Permanent / Non-Drop',
    features: ['Real Channel Growth', 'Active Google Profiles', 'Refill Warranty 30 Days', 'Safe Algorithm Delivery']
  },
  {
    id: 'exp-likes-500',
    serviceType: 'likes',
    title: '500 Organic YouTube Likes',
    amount: 500,
    priceUsd: 11.99,
    deliveryTime: '4-8 Hours',
    retention: 'Natural Distribution',
    features: ['Elevate Social Proof', 'High Retention Profiles', 'Instant Start', 'Monetization Safe']
  },
  {
    id: 'exp-watchtime-1000h',
    serviceType: 'watch_time',
    title: '1,000 YouTube Watch Hours',
    amount: 1000,
    priceUsd: 49.99,
    deliveryTime: '2-4 Days',
    retention: 'Full Long Video Pacing',
    features: ['Monetization Goal Booster (4,000 Hrs)', '15+ Minute Video Support', 'AdSense Compliant', 'Guaranteed Retention']
  }
];

export const INITIAL_EXCHANGE_VIDEOS: ExchangeVideo[] = [
  {
    id: 'vid-1',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Ultimate 2026 YouTube Growth Masterclass (Full Blueprint)',
    channel: 'CreatorPulse Media',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    duration: 35,
    rewardCredits: 45,
    category: 'Education'
  },
  {
    id: 'vid-2',
    youtubeId: 'L_LUpnjgPso',
    title: 'Top 10 High-Tech Desk Setups for Creators in 2026',
    channel: 'TechVibe Studios',
    thumbnail: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=600&q=80',
    duration: 40,
    rewardCredits: 55,
    category: 'Technology'
  },
  {
    id: 'vid-3',
    youtubeId: 'kXYiU_JCYtU',
    title: 'Deep Focus Lo-Fi Chill Beats for Coding & Studying',
    channel: 'Zenith Soundscapes',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: 50,
    rewardCredits: 70,
    category: 'Music'
  },
  {
    id: 'vid-4',
    youtubeId: 'kJQP7kiw5Fk',
    title: 'How I Hit 100,000 Subscribers in 6 Months (Zero Ads)',
    channel: 'ViralForge Insights',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    duration: 30,
    rewardCredits: 40,
    category: 'Marketing'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-101',
    videoUrl: 'https://www.youtube.com/watch?v=sample123',
    videoTitle: 'Mastering Full-Stack Web Development in 2026',
    channelName: 'CodeMaster Lab',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    serviceType: 'views',
    targetAmount: 5000,
    deliveredAmount: 3840,
    durationSec: 90,
    speedPerHour: 150,
    countryTarget: 'Worldwide',
    costCredits: 7500,
    status: 'active',
    createdAt: '2026-08-15'
  },
  {
    id: 'camp-102',
    videoUrl: 'https://www.youtube.com/watch?v=sample456',
    videoTitle: 'New Electro Synthwave Single (Official Visualizer)',
    channelName: 'CyberPulse Audio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    serviceType: 'likes',
    targetAmount: 500,
    deliveredAmount: 462,
    durationSec: 60,
    speedPerHour: 50,
    countryTarget: 'United States, UK, Canada',
    costCredits: 2500,
    status: 'active',
    createdAt: '2026-08-16'
  },
  {
    id: 'camp-103',
    videoUrl: 'https://www.youtube.com/watch?v=sample789',
    videoTitle: 'Channel Growth Accelerator (Subscribe to Win)',
    channelName: 'Nexus Creator Guild',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    serviceType: 'subscribers',
    targetAmount: 200,
    deliveredAmount: 200,
    durationSec: 0,
    speedPerHour: 20,
    countryTarget: 'Worldwide',
    costCredits: 4000,
    status: 'completed',
    createdAt: '2026-08-12'
  }
];
