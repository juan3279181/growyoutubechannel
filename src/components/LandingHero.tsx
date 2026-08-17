import React, { useState } from 'react';
import { Campaign } from '../types';
import { 
  Play, Zap, ShieldCheck, Flame, Users, TrendingUp, 
  Eye, ThumbsUp, UserPlus, Clock, Sparkles, CheckCircle2, 
  ArrowRight, Shield, Award, ChevronRight, HelpCircle, Radio, ExternalLink
} from 'lucide-react';

interface LandingHeroProps {
  campaigns?: Campaign[];
  onStartExchange: () => void;
  onOpenStore: () => void;
  onOpenCampaigns: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onOpenProfile?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  campaigns = [],
  onStartExchange,
  onOpenStore,
  onOpenCampaigns,
  onOpenAuthModal,
  onOpenProfile
}) => {
  const [calcViews, setCalcViews] = useState(10000);
  const [calcRetention, setCalcRetention] = useState(120);

  // Growth calculator values
  const totalWatchHours = Math.round((calcViews * calcRetention) / 3600);
  const estimatedSubscribers = Math.round(calcViews * 0.04);
  const requiredCredits = Math.round(calcViews * 1.5 * (calcRetention / 30));

  const activeCampaigns = campaigns.filter((c) => c.status === 'active');

  return (
    <div className="space-y-16 animate-in fade-in duration-300 pb-8">
      {/* Hero Header Section */}
      <div className="relative pt-6 pb-12 text-center max-w-4xl mx-auto space-y-6">
        {/* Glowing background halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-rose-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 bg-[#16192d] border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-black text-indigo-300 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>World's #1 YouTube Creator Growth & Credit Exchange Network</span>
        </div>

        {/* Big Catchy Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display leading-[1.1]">
          Skyrocket Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-400 to-indigo-400">YouTube Views</span>, Likes & Subscribers
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          YTMonster is the organic exchange engine that connects real creators worldwide. Earn free credits by viewing community videos or buy packages instantly via PayPal & Bitcoin for rapid monetization!
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onOpenAuthModal && (
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Free Account (+1,000 Credits)</span>
            </button>
          )}

          <button
            onClick={onStartExchange}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Exchanger (Earn Free)</span>
          </button>

          <button
            onClick={onOpenStore}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#16192d] hover:bg-[#1f233d] border border-slate-700 hover:border-slate-600 text-white rounded-2xl font-black text-sm transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Buy Credits</span>
          </button>
        </div>

        {/* Trust Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Real Creators (Zero Bots)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>YouTube Partner Program & AdSense Safe</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant Digital Delivery</span>
          </span>
        </div>
      </div>

      {/* Real-time Live Active Campaigns Pool Ticker */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <h3 className="text-lg font-black text-white">Live Community Exchange Pool</h3>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCampaigns.length} Active Video Campaigns
            </span>
          </div>

          <button
            onClick={onOpenCampaigns}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
          >
            <span>+ Submit Your Video</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCampaigns.slice(0, 6).map((camp) => {
            const progress = Math.min(100, Math.round((camp.deliveredAmount / camp.targetAmount) * 100));
            return (
              <div
                key={camp.id}
                className="bg-[#121528] border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 space-y-3 transition shadow-lg group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={camp.thumbnailUrl}
                    alt={camp.videoTitle}
                    className="w-16 h-12 rounded-xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition duration-300"
                  />
                  <div className="truncate">
                    <span className="text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                      {camp.serviceType}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1">{camp.videoTitle}</h4>
                    <span className="text-[10px] text-slate-400">{camp.channelName}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Delivered</span>
                    <span className="text-emerald-400 font-bold">{camp.deliveredAmount.toLocaleString()} / {camp.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={onStartExchange}
                  className="w-full py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-[11px] font-bold text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Exchange & Watch Now</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div className="bg-[#121528] border border-slate-800/80 p-5 rounded-3xl text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">2,480,000+</span>
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Registered Creators</span>
        </div>
        <div className="bg-[#121528] border border-slate-800/80 p-5 rounded-3xl text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">895,000,000+</span>
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Views Exchanged</span>
        </div>
        <div className="bg-[#121528] border border-slate-800/80 p-5 rounded-3xl text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">4,350,000+</span>
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Watch Hours Built</span>
        </div>
        <div className="bg-[#121528] border border-slate-800/80 p-5 rounded-3xl text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">99.9%</span>
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Retention Safety</span>
        </div>
      </div>

      {/* 3 Step "How YTMonster Works" Section */}
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">How YTMonster Works</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            A frictionless peer-to-peer exchange engine designed to trigger YouTube's recommendation algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-[#121528] border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 space-y-4 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Earn Free Credits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open the YTMonster Client Exchanger in your browser. The client automatically plays videos from other creators and credits your account balance with coins in real time.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#121528] border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 space-y-4 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Submit Your Campaign</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste your YouTube video URL, choose your exact watch duration (up to 300s+ for max retention), select your delivery pace, and allocate your credits.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#121528] border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 space-y-4 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Rank & Monetize</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High audience retention signals YouTube's algorithm that your content is engaging, pushing your video to Recommended feeds, Search Results, and Home feeds.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Growth & Watch Time Calculator */}
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#141830] to-[#0f1224] border border-indigo-900/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Channel Strategy Tool</span>
            <h3 className="text-xl font-black text-white mt-0.5">YouTube Growth & Monetization Estimator</h3>
          </div>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 self-start sm:self-auto">
            Algorithm Optimization
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sliders */}
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">Target Views:</span>
                <span className="text-indigo-400 font-mono font-black">{calcViews.toLocaleString()} Views</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={calcViews}
                onChange={(e) => setCalcViews(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">Watch Retention Duration:</span>
                <span className="text-purple-400 font-mono font-black">{calcRetention} Seconds</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="15"
                value={calcRetention}
                onChange={(e) => setCalcRetention(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Higher retention times (90s - 240s) drastically improve your YouTube video's click-through-rate (CTR) and algorithm recommendation score.
            </p>
          </div>

          {/* Result Card */}
          <div className="bg-[#0e1022] p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Channel Outcome</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#151932] p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Generated Watch Time</span>
                <span className="text-lg font-black text-amber-300 font-mono">{totalWatchHours} Hours</span>
              </div>

              <div className="bg-[#151932] p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Organic Subscriber Yield</span>
                <span className="text-lg font-black text-emerald-400 font-mono">~{estimatedSubscribers} Subs</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Required Credits:</span>
              <span className="text-sm font-black text-white font-mono">{requiredCredits.toLocaleString()} ⚡</span>
            </div>

            <button
              onClick={onOpenStore}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md shadow-amber-500/20"
            >
              Get Credits in Store (PayPal / Bitcoin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

