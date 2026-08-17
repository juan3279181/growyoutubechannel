import React, { useState } from 'react';
import { UserAccount, PaymentOrder } from '../types';
import { 
  Zap, Gift, Flame, Copy, Check, ExternalLink, 
  Crown, Eye, ThumbsUp, UserPlus, TrendingUp, ShieldCheck, 
  History, Sparkles, ArrowUpRight, DollarSign
} from 'lucide-react';

interface DashboardOverviewProps {
  user: UserAccount;
  orders: PaymentOrder[];
  onClaimDailyBonus: () => void;
  canClaimDaily: boolean;
  onOpenStore: () => void;
  onGoToExchange: () => void;
  onGoToCampaigns: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  orders,
  onClaimDailyBonus,
  canClaimDaily,
  onOpenStore,
  onGoToExchange,
  onGoToCampaigns
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const refUrl = `https://ytmonster.net/register?ref=${user.referralCode}`;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(refUrl);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome & Top Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#14172f] via-[#1b1f3e] to-[#14172f] p-6 rounded-3xl border border-indigo-900/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Creator Dashboard</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Account Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-display">
            Welcome back, {user.username}!
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your channel growth center &bull; Email: <span className="text-slate-300">{user.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canClaimDaily && (
            <button
              onClick={onClaimDailyBonus}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs transition shadow-lg shadow-amber-500/20 animate-pulse"
            >
              <Gift className="w-4 h-4" />
              <span>Claim +500 Daily Bonus</span>
            </button>
          )}

          <button
            onClick={onOpenStore}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-black text-xs transition shadow-lg shadow-indigo-600/30"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Top Up Credits</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credits Balance */}
        <div className="bg-[#121528] border border-slate-800 rounded-3xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits Balance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
              {user.credits.toLocaleString()}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">Available for campaigns</span>
          </div>
          <button
            onClick={onGoToCampaigns}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
          >
            <span>Start campaign</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Membership Tier */}
        <div className="bg-[#121528] border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">VIP Tier</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-purple-300 uppercase tracking-wide">
              {user.membershipTier} Tier
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              {user.membershipTier === 'pro' ? '2.5x Earning Turbo' : user.membershipTier === 'premium' ? '1.75x Multiplier' : user.membershipTier === 'lite' ? '1.25x Multiplier' : '1.0x Standard'}
            </span>
          </div>
          <button
            onClick={onOpenStore}
            className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 transition"
          >
            <span>Upgrade tier</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Views & Actions Given */}
        <div className="bg-[#121528] border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exchange Actions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {(user.viewsGiven + user.likesGiven + user.subsGiven).toLocaleString()}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              {user.viewsGiven} Views &bull; {user.likesGiven} Likes &bull; {user.subsGiven} Subs
            </span>
          </div>
          <button
            onClick={onGoToExchange}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition"
          >
            <span>Open client exchanger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Daily Streak */}
        <div className="bg-[#121528] border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Streak</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-orange-300 font-mono">
              {user.dailyStreak} Days
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">+500 credits claimed daily</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Streak multiplier active</span>
          </span>
        </div>
      </div>

      {/* Referral Program Section */}
      <div className="bg-[#121528] border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-black text-white">YTMonster Referral Partner Program</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Share your link and earn <strong className="text-emerald-400">15% Lifetime Commission</strong> on all credits and VIP subscriptions purchased by your invited creators.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0e1020] px-3 py-1.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Referrals</span>
              <span className="text-sm font-black text-white font-mono">{user.referralsCount}</span>
            </div>
            <div className="bg-[#0e1020] px-3 py-1.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Earned</span>
              <span className="text-sm font-black text-amber-300 font-mono">+{user.referralEarnings.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Link box */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0d0f1e] p-3 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 shrink-0">Your Affiliate Link:</span>
          <code className="text-xs font-bold text-indigo-300 flex-1 truncate font-mono bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 w-full sm:w-auto">
            {refUrl}
          </code>
          <button
            type="button"
            onClick={handleCopyRef}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/30"
          >
            {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRef ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Recent Digital Order & Balance History */}
      <div className="bg-[#121528] border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-black text-white">Digital Payment & Fulfillment History</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Instant Digital Delivery (No Shipping)</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No store purchases yet. Your purchases via PayPal & Bitcoin will appear here with instant digital fulfillment receipts.
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#0e1020] border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{order.itemName}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Delivered to Balance
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] block mt-0.5">
                    Order ID: <code className="text-slate-300 font-mono">{order.id}</code> &bull; Method:{' '}
                    <span className="text-indigo-300 font-semibold uppercase">{order.paymentMethod}</span>
                  </span>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <span className="text-sm font-black text-emerald-400 font-mono">${order.amountUsd.toFixed(2)} USD</span>
                    <span className="text-[10px] text-slate-400 block font-mono">≈ {order.amountBtc} BTC</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
