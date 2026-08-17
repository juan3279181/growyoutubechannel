export type ServiceType = 'views' | 'high_retention' | 'likes' | 'subscribers' | 'comments' | 'watch_time';

export type MembershipTier = 'free' | 'lite' | 'premium' | 'pro';

export interface ProofVerification {
  id: string;
  type: 'sub' | 'like';
  videoUrl: string;
  channelName: string;
  screenshotUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
  reason?: string;
}

export interface UserAccount {
  uid?: string;
  username: string;
  email: string;
  credits: number;
  membershipTier: MembershipTier;
  dailyStreak: number;
  lastDailyClaim: string | null;
  totalEarned: number;
  totalSpent: number;
  viewsGiven: number;
  likesGiven: number;
  subsGiven: number;
  referralCode: string;
  referralsCount: number;
  referralEarnings: number;
  youtubeChannelUrl?: string;
  avatarUrl?: string;
  joinedDate?: string;
  verifications?: ProofVerification[];
}

export interface CreditPackage {
  id: string;
  credits: number;
  priceUsd: number;
  bonusCredits: number;
  popular?: boolean;
  bestValue?: boolean;
  tagline: string;
}

export interface MembershipPlan {
  id: MembershipTier;
  name: string;
  priceUsdMonthly: number;
  dailyCredits: number;
  activeCampaignSlots: number;
  earningMultiplier: number;
  prioritySupport: boolean;
  customPacing: boolean;
  features: string[];
  popular?: boolean;
}

export interface ExpressService {
  id: string;
  serviceType: ServiceType;
  title: string;
  amount: number;
  priceUsd: number;
  deliveryTime: string;
  retention: string;
  features: string[];
}

export interface Campaign {
  id: string;
  userId?: string;
  videoUrl: string;
  videoTitle: string;
  channelName: string;
  thumbnailUrl: string;
  serviceType: ServiceType;
  targetAmount: number;
  deliveredAmount: number;
  durationSec: number;
  speedPerHour: number;
  countryTarget: string;
  costCredits: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export interface ExchangeVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: number; // in seconds
  rewardCredits: number;
  category: string;
}

export interface PaymentOrder {
  id: string;
  userId?: string;
  itemId: string;
  itemType: 'credits' | 'membership' | 'express';
  itemName: string;
  itemDetails: string;
  amountUsd: number;
  amountBtc: number;
  paymentMethod: 'paypal' | 'btc' | 'bitcoin';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  recipientPayPal: string;
  recipientBtc: string;
  txHash?: string;
}
