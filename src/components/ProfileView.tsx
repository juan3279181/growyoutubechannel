import React, { useState } from 'react';
import { UserAccount, Campaign, PaymentOrder } from '../types';
import { 
  User, Mail, Crown, Zap, Flame, Eye, ThumbsUp, 
  UserPlus, Gift, Copy, Check, ExternalLink, ShieldCheck, 
  LogOut, PlusCircle, History, Sparkles, Edit3, ArrowUpRight,
  TrendingUp, Clock, CheckCircle2, Play, AlertCircle, RefreshCw
} from 'lucide-react';

interface ProfileViewProps {
  user: UserAccount;
  campaigns: Campaign[];
  orders: PaymentOrder[];
  onOpenStore: () => void;
  onOpenCampaigns: () => void;
  onOpenExchange: () => void;
  onClaimDailyBonus: () => void;
  canClaimDaily: boolean;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onUpdateProfile: (updated: Partial<UserAccount>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  campaigns,
  orders,
  onOpenStore,
  onOpenCampaigns,
  onOpenExchange,
  onClaimDailyBonus,
  canClaimDaily,
  onOpenAuthModal,
  onLogout,
  onUpdateProfile
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editYoutubeChannel, setEditYoutubeChannel] = useState(user.youtubeChannelUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter campaigns created by this specific user
  const myCampaigns = campaigns.filter(
    (c) => c.userId === user.username || c.userId === user.uid || !c.userId
  );
  const activeMyCampaigns = myCampaigns.filter((c) => c.status === 'active');
  const completedMyCampaigns = myCampaigns.filter((c) => c.status === 'completed');

  const refUrl = `https://ytmonster.net/register?ref=${user.referralCode}`;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(refUrl);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2200);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUsername.trim()) return;
    onUpdateProfile({
      username: editUsername.trim(),
      youtubeChannelUrl: editYoutubeChannel.trim()
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getTierDetails = (tier: UserAccount['membershipTier']) => {
    switch (tier) {
      case 'pro':
        return {
          title: 'PRO VIP Tier',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          multiplier: '2.5x Turbo Earning',
          slots: 'Unlimited Active Campaigns',
          support: 'Priority VIP Support'
        };
      case 'premium':
        return {
          title: 'PREMIUM Tier',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          multiplier: '1.75x Multiplier',
          slots: '10 Active Campaigns',
          support: 'Priority Support'
        };
      case 'lite':
        return {
          title: 'LITE Tier',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          multiplier: '1.25x Multiplier',
          slots: '5 Active Campaigns',
          support: 'Standard Support'
        };
      default:
        return {
          title: 'FREE Standard Tier',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          multiplier: '1.0x Base Earning',
          slots: '3 Active Campaigns',
          support: 'Community Support'
        };
    }
  };

  const tierDetails = getTierDetails(user.membershipTier);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Banner & Profile Header */}
      <div className="bg-gradient-to-r from-[#141732] via-[#1a1e42] to-[#12142a] border border-indigo-900/50 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* User Info & Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-purple-600 p-1 shadow-xl shadow-indigo-600/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#0c0e1e] rounded-[22px] flex items-center justify-center text-3xl sm:text-4xl font-black text-white">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-2 border-[#0c0e1e] w-6 h-6 rounded-full flex items-center justify-center" title="Live Cloud Sync Active">
                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
                  {user.username}
                </h1>
                <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${tierDetails.badge} flex items-center gap-1`}>
                  <Crown className="w-3.5 h-3.5" />
                  <span>{tierDetails.title}</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Profile</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{user.email || 'No email registered'}</span>
                </span>
                <span>&bull;</span>
                <span className="font-mono text-slate-400">
                  UID: <code className="text-indigo-300 font-semibold">{user.uid ? user.uid.slice(0, 12) + '...' : 'creator-live'}</code>
                </span>
                <span>&bull;</span>
                <span>Member Since {user.joinedDate || '2026-08'}</span>
              </div>

              {user.youtubeChannelUrl && (
                <div className="pt-0.5">
                  <a
                    href={user.youtubeChannelUrl.startsWith('http') ? user.youtubeChannelUrl : `https://${user.youtubeChannelUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-bold inline-flex items-center gap-1 transition"
                  >
                    <span>Connected YouTube Channel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white transition flex items-center gap-1.5 border border-slate-700"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={() => onOpenAuthModal('login')}
              className="px-3.5 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-xs font-bold text-indigo-300 hover:text-white transition flex items-center gap-1.5 border border-indigo-700/40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs font-bold text-rose-300 hover:text-rose-200 transition flex items-center gap-1.5 border border-rose-800/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top duration-200">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">Display / Creator Username</label>
              <input
                type="text"
                required
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full bg-[#0a0c18] border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">YouTube Channel URL / Handle</label>
              <input
                type="text"
                value={editYoutubeChannel}
                onChange={(e) => setEditYoutubeChannel(e.target.value)}
                placeholder="https://youtube.com/@MyChannel"
                className="w-full bg-[#0a0c18] border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile information successfully updated in cloud storage!</span>
          </div>
        )}
      </div>

      {/* Primary Creator Stats Metric Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Creator Balance & Exchange Statistics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Credits Balance */}
          <div className="bg-[#121528] border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 space-y-3 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Credits</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                ⚡
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-amber-300 font-mono tracking-tight">
                {user.credits.toLocaleString()}
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5">Available for video growth</span>
            </div>
            <button
              onClick={onOpenStore}
              className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 border border-amber-500/30"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Top Up Balance</span>
            </button>
          </div>

          {/* Lifetime Earned */}
          <div className="bg-[#121528] border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lifetime Earned</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {user.totalEarned.toLocaleString()}
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5">From watching & bonuses</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">
              Daily Bonus: <strong className="text-white">+{user.dailyStreak * 500}</strong> total
            </span>
          </div>

          {/* Total Invested */}
          <div className="bg-[#121528] border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits Invested</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-indigo-300 font-mono">
                {user.totalSpent.toLocaleString()}
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5">Delivered to your videos</span>
            </div>
            <button
              onClick={onOpenCampaigns}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
            >
              <span>View campaigns</span>
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
              <span className="text-3xl font-black text-orange-300 font-mono">
                {user.dailyStreak} Days
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5">Active creator multiplier</span>
            </div>
            {canClaimDaily ? (
              <button
                onClick={onClaimDailyBonus}
                className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black rounded-xl transition shadow animate-pulse"
              >
                +500 Claim Available
              </button>
            ) : (
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Today's Bonus Claimed</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Exchanger Community Support Breakdown */}
      <div className="bg-[#121528] border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Community Engagement & Actions Delivered</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed tracking of your contributions watching and supporting other community creators.
            </p>
          </div>

          <button
            onClick={onOpenExchange}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Client Exchanger</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0e1020] border border-slate-800/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold">Total Videos Watched</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl font-black text-white font-mono">{user.viewsGiven.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block">≈ {Math.round((user.viewsGiven * 65) / 60)} minutes watch time</span>
          </div>

          <div className="bg-[#0e1020] border border-slate-800/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold">Likes Given</span>
              <ThumbsUp className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-2xl font-black text-rose-300 font-mono">{user.likesGiven.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block">Organic algorithm boost given</span>
          </div>

          <div className="bg-[#0e1020] border border-slate-800/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold">Subscribers Given</span>
              <UserPlus className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-2xl font-black text-purple-300 font-mono">{user.subsGiven.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block">Channels subscribed</span>
          </div>
        </div>
      </div>

      {/* My Active & Completed Campaigns Section */}
      <div className="bg-[#121528] border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <h3 className="text-base font-black text-white">My YouTube Video Campaigns</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live tracking for videos promoted on your creator account ({myCampaigns.length} campaigns created).
            </p>
          </div>

          <button
            onClick={onOpenCampaigns}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Create New Campaign</span>
          </button>
        </div>

        {myCampaigns.length === 0 ? (
          <div className="text-center py-8 bg-[#0e1020] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center font-bold">
              <Play className="w-6 h-6 ml-0.5" />
            </div>
            <h4 className="text-sm font-bold text-white">No campaigns active on this profile yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Use your available credits to launch a views, likes, or subscribers campaign for your YouTube videos.
            </p>
            <button
              onClick={onOpenCampaigns}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
            >
              Start First Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCampaigns.map((camp) => {
              const progress = Math.min(100, Math.round((camp.deliveredAmount / camp.targetAmount) * 100));
              return (
                <div
                  key={camp.id}
                  className="bg-[#0e1020] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={camp.thumbnailUrl}
                      alt={camp.videoTitle}
                      className="w-20 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                          {camp.serviceType}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            camp.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : camp.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {camp.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-1">{camp.videoTitle}</h4>
                      <span className="text-[10px] text-slate-400">{camp.channelName}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Delivery Progress</span>
                      <span className="text-emerald-400 font-bold">
                        {camp.deliveredAmount.toLocaleString()} / {camp.targetAmount.toLocaleString()} ({progress}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Referral Program Affiliate Hub */}
      <div className="bg-[#121528] border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-black text-white">Your Affiliate Referral Statistics</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Earn 15% lifetime commission on every credit pack or VIP tier purchased by your invited creators.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0e1020] px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Invited Friends</span>
              <span className="text-sm font-black text-white font-mono">{user.referralsCount}</span>
            </div>
            <div className="bg-[#0e1020] px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Commissions</span>
              <span className="text-sm font-black text-amber-300 font-mono">+{user.referralEarnings.toLocaleString()} ⚡</span>
            </div>
          </div>
        </div>

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
            <span>{copiedRef ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>
        </div>
      </div>

      {/* Digital Invoices & Purchase Fulfillment */}
      <div className="bg-[#121528] border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-black text-white">Digital Order & Payment History</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">PayPal & Bitcoin Fulfillment</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No purchases logged on this profile yet. Orders processed through the Store will be recorded here.
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
