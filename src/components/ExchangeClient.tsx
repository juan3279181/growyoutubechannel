import React, { useState, useEffect } from 'react';
import { UserAccount, ExchangeVideo, Campaign } from '../types';
import { INITIAL_EXCHANGE_VIDEOS } from '../data/ytmonsterData';
import { VerificationModal } from './VerificationModal';
import { 
  Play, Pause, Zap, CheckCircle, Flame, Eye, ThumbsUp, 
  UserPlus, Sparkles, Volume2, VolumeX, Shield, Clock, 
  Layers, ArrowRight, RefreshCw, Trophy
} from 'lucide-react';

interface ExchangeClientProps {
  user: UserAccount;
  communityCampaigns?: Campaign[];
  onEarnCredits: (amount: number, type: 'view' | 'like' | 'sub') => void;
  onCampaignWatched?: (campaignId: string, currentDelivered: number, target: number) => void;
  onExchangingStateChange?: (isExchanging: boolean) => void;
  onOpenStore: () => void;
}

export const ExchangeClient: React.FC<ExchangeClientProps> = ({
  user,
  communityCampaigns = [],
  onEarnCredits,
  onCampaignWatched,
  onExchangingStateChange,
  onOpenStore
}) => {
  const [exchangeMode, setExchangeMode] = useState<'views' | 'likes' | 'subs'>('views');
  const [isRunning, setIsRunning] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [sessionCredits, setSessionCredits] = useState(0);
  const [sessionVideosCount, setSessionVideosCount] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [justEarned, setJustEarned] = useState<number | null>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationMode, setVerificationMode] = useState<'sub' | 'like'>('sub');
  const [pendingVerificationVideo, setPendingVerificationVideo] = useState<ExchangeVideo | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Helper to extract YouTube video ID
  const extractYtId = (url: string): string => {
    if (!url) return 'community';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : 'community';
  };

  // Combine initial sample videos with active community campaigns
  const activeCommunityVideos: ExchangeVideo[] = communityCampaigns
    .filter((c) => c.status === 'active')
    .map((c) => {
      const ytId = extractYtId(c.videoUrl);
      const thumbnail = ytId !== 'community'
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : c.thumbnailUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80';

      return {
        id: c.id,
        youtubeId: ytId,
        title: c.videoTitle,
        channel: c.channelName || 'Community Creator',
        thumbnail: thumbnail,
        duration: Math.max(30, c.durationSec || 60),
        rewardCredits: Math.round((c.durationSec || 60) * 1.2),
        category: `🌟 Community ${c.serviceType.toUpperCase()}`
      };
    });

  // Prioritize live community campaigns first in queue
  const allVideos: ExchangeVideo[] = activeCommunityVideos.length > 0 
    ? [...activeCommunityVideos, ...INITIAL_EXCHANGE_VIDEOS]
    : INITIAL_EXCHANGE_VIDEOS;
  const currentVideo: ExchangeVideo = allVideos[currentVideoIndex % allVideos.length] || INITIAL_EXCHANGE_VIDEOS[0];

  // Multipliers based on membership tier
  const multiplier = user.membershipTier === 'pro' ? 2.5 : user.membershipTier === 'premium' ? 1.75 : user.membershipTier === 'lite' ? 1.25 : 1.0;

  // Track exchange state for presence
  useEffect(() => {
    onExchangingStateChange?.(isRunning);
  }, [isRunning, onExchangingStateChange]);

  // Countdown timer when exchange client is running
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && exchangeMode === 'views') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Award credits
            const baseCredits = currentVideo.rewardCredits;
            const totalReward = Math.round(baseCredits * multiplier);
            
            onEarnCredits(totalReward, 'view');
            setSessionCredits((c) => c + totalReward);
            setSessionVideosCount((v) => v + 1);
            setJustEarned(totalReward);
            setTimeout(() => setJustEarned(null), 3000);

            // If this was a community campaign, update delivered count in Firestore
            const matchedCamp = communityCampaigns.find((c) => c.id === currentVideo.id);
            if (matchedCamp && onCampaignWatched) {
              onCampaignWatched(matchedCamp.id, (matchedCamp.deliveredAmount || 0) + 1, matchedCamp.targetAmount);
            }

            // Move to next video
            setCurrentVideoIndex((idx) => (idx + 1) % allVideos.length);
            const nextVid = allVideos[(currentVideoIndex + 1) % allVideos.length];
            return nextVid ? nextVid.duration : 45;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, currentVideoIndex, exchangeMode, multiplier, allVideos, currentVideo, communityCampaigns, onCampaignWatched, onEarnCredits]);

  const handleToggleRunning = () => {
    if (!isRunning) {
      setTimeLeft(currentVideo.duration);
    }
    setIsRunning(!isRunning);
  };

  const handleManualLike = () => {
    setVerificationMode('like');
    setPendingVerificationVideo(currentVideo);
    setVerificationModalOpen(true);
  };

  const handleManualSub = () => {
    setVerificationMode('sub');
    setPendingVerificationVideo(currentVideo);
    setVerificationModalOpen(true);
  };

  const handleVerificationSubmit = async (screenshotUrl: string, confirmMessage: string) => {
    setIsVerifying(true);
    
    // Simulate verification delay (in production, this would call a backend API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Award credits after verification
    const reward = verificationMode === 'like' 
      ? Math.round(35 * multiplier)
      : Math.round(90 * multiplier);
    
    onEarnCredits(reward, verificationMode);
    setSessionCredits((c) => c + reward);
    setJustEarned(reward);
    setTimeout(() => setJustEarned(null), 2500);
    
    // Move to next video
    setCurrentVideoIndex((idx) => (idx + 1) % allVideos.length);
    
    // Close modal and reset
    setVerificationModalOpen(false);
    setPendingVerificationVideo(null);
    setIsVerifying(false);
  };

  const progressPercent = Math.max(0, Math.min(100, ((currentVideo.duration - timeLeft) / currentVideo.duration) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Client Stats */}
      <div className="bg-gradient-to-r from-[#141830] via-[#1b1f3d] to-[#141830] border border-indigo-900/40 rounded-3xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Official YouTube Exchange Engine
              </span>
              {user.membershipTier !== 'free' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {multiplier}x Tier Boost Active
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white mt-1.5 font-display">
              YTMonster Client Exchanger
            </h1>
            <p className="text-xs lg:text-sm text-slate-400 max-w-xl mt-1">
              Watch real creator videos or like/subscribe to earn high-value credits automatically. Use credits to start your own high-retention campaigns!
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-[#0f1122]/80 border border-slate-800 p-3 rounded-2xl flex-1 md:flex-initial text-center md:text-left min-w-[120px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Session Earned</span>
              <span className="text-lg font-black text-amber-300 font-mono">+{sessionCredits.toLocaleString()}</span>
            </div>
            <div className="bg-[#0f1122]/80 border border-slate-800 p-3 rounded-2xl flex-1 md:flex-initial text-center md:text-left min-w-[120px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Videos Completed</span>
              <span className="text-lg font-black text-indigo-300 font-mono">{sessionVideosCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Mode Switcher */}
      <div className="flex items-center gap-2 bg-[#121426] p-1.5 rounded-2xl border border-slate-800/80 max-w-md">
        <button
          onClick={() => { setExchangeMode('views'); setIsRunning(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition ${
            exchangeMode === 'views'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Auto Views</span>
        </button>

        <button
          onClick={() => { setExchangeMode('likes'); setIsRunning(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition ${
            exchangeMode === 'likes'
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Like Exchange</span>
        </button>

        <button
          onClick={() => { setExchangeMode('subs'); setIsRunning(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition ${
            exchangeMode === 'subs'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Sub Exchange</span>
        </button>
      </div>

      {/* Main Interactive Player Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Live Exchanger Video Player */}
        <div className="lg:col-span-2 bg-[#121528] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative">
          {/* Award popup alert */}
          {justEarned !== null && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-6 py-2 rounded-full font-black text-sm shadow-2xl flex items-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span>+{justEarned} Credits Added to Balance!</span>
            </div>
          )}

          {/* Player Screen Frame */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl group">
            {/* Background Simulated Video Image */}
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              className={`w-full h-full object-cover transition duration-700 ${isRunning ? 'scale-105 brightness-90' : 'brightness-50'}`}
            />

            {/* Video overlay watermark */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`}></span>
                {isRunning ? 'EXCHANGING LIVE' : 'CLIENT STANDBY'}
              </span>
              <span className="bg-indigo-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-200 border border-indigo-500/20">
                {currentVideo.category}
              </span>
            </div>

            {/* Audio Mute toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition border border-white/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Centered Controls / Status */}
            {!isRunning && exchangeMode === 'views' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/60 backdrop-blur-xs">
                <button
                  onClick={handleToggleRunning}
                  className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-rose-600/40 hover:scale-110 active:scale-95 transition"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
                <h3 className="text-lg font-black text-white mt-4">Start YouTube Auto-Exchange</h3>
                <p className="text-xs text-slate-300 max-w-sm mt-1">
                  Keep this tab open while the client automatically cycles through videos and credits your balance.
                </p>
              </div>
            )}

            {/* Like Exchange Mode Center UI */}
            {exchangeMode === 'likes' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/60 backdrop-blur-xs">
                <div className="bg-[#121428]/95 p-6 rounded-3xl border border-rose-500/30 max-w-md shadow-2xl space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                    <ThumbsUp className="w-6 h-6 fill-rose-500/30" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Like This Video to Earn Credits</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Reward: <strong className="text-amber-300">+{Math.round(35 * multiplier)} Credits</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleManualLike}
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-rose-600/30 transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Like Video & Collect +{Math.round(35 * multiplier)} Coins</span>
                  </button>
                </div>
              </div>
            )}

            {/* Subscribe Exchange Mode Center UI */}
            {exchangeMode === 'subs' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/60 backdrop-blur-xs">
                <div className="bg-[#121428]/95 p-6 rounded-3xl border border-emerald-500/30 max-w-md shadow-2xl space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Subscribe to Channel</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Channel: <span className="text-white font-bold">{currentVideo.channel}</span> &bull; Reward: <strong className="text-amber-300">+{Math.round(90 * multiplier)} Credits</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleManualSub}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Subscribe & Collect +{Math.round(90 * multiplier)} Coins</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Floating Bar in Video */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex items-center justify-between z-10">
              <div className="truncate pr-4">
                <h4 className="text-sm font-bold text-white truncate">{currentVideo.title}</h4>
                <p className="text-[11px] text-slate-300">{currentVideo.channel}</p>
              </div>

              {exchangeMode === 'views' && isRunning && (
                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Remaining</span>
                    <span className="text-sm font-black text-amber-300 font-mono">{timeLeft}s</span>
                  </div>
                </div>
              )}
            </div>

            {/* Animated Progress Bar */}
            {exchangeMode === 'views' && isRunning && (
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Action Bar Beneath Player */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#171a30] p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {exchangeMode === 'views' && (
                <button
                  onClick={handleToggleRunning}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition shadow-lg ${
                    isRunning
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isRunning ? 'Pause Exchanger' : 'Start Auto-Exchanger'}</span>
                </button>
              )}

              <button
                onClick={() => setCurrentVideoIndex((idx) => (idx + 1) % allVideos.length)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-bold flex items-center gap-1.5"
                title="Skip to next video in queue"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Skip Video</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Video Duration: <strong className="text-white">{currentVideo.duration}s</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Potential: <strong className="text-amber-300">+{Math.round(currentVideo.rewardCredits * multiplier)} Coins</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Exchange Multipliers & Queue */}
        <div className="space-y-4">
          {/* Earning Speed Booster Card */}
          <div className="bg-[#14172c] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Flame className="w-4 h-4" />
                Multiplier Engine
              </span>
              <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full">
                {multiplier}x Active
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Membership:</span>
                <span className="text-white font-bold uppercase">{user.membershipTier}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Base Reward Rate:</span>
                <span className="text-white font-mono">1.0x (Standard)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">VIP Pro Acceleration:</span>
                <span className="text-emerald-400 font-mono font-bold">Up to 2.5x</span>
              </div>
            </div>

            <button
              onClick={onOpenStore}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Boost Multiplier in VIP Store</span>
            </button>
          </div>

          {/* Exchange Queue */}
          <div className="bg-[#14172c] border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Next in Queue ({allVideos.length - 1})
              </h4>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Pool
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {allVideos.map((vid, idx) => (
                <div
                  key={vid.id}
                  onClick={() => setCurrentVideoIndex(idx)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition ${
                    idx === currentVideoIndex % allVideos.length
                      ? 'bg-indigo-950/60 border border-indigo-500/40 text-white'
                      : 'bg-[#0f1120] border border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-12 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="truncate flex-1">
                    <h5 className="text-[11px] font-bold text-white truncate">{vid.title}</h5>
                    <span className="text-[10px] text-slate-400">{vid.duration}s &bull; +{Math.round(vid.rewardCredits * multiplier)} coins</span>
                  </div>
                  {idx === currentVideoIndex % allVideos.length && (
                    <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded shrink-0">
                      Playing
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {pendingVerificationVideo && (
        <VerificationModal
          isOpen={verificationModalOpen}
          type={verificationMode}
          videoTitle={pendingVerificationVideo.title}
          channelName={pendingVerificationVideo.channel}
          onClose={() => {
            setVerificationModalOpen(false);
            setPendingVerificationVideo(null);
          }}
          onVerify={handleVerificationSubmit}
          isLoading={isVerifying}
        />
      )}
    </div>
  );
};
