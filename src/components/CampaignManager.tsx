import React, { useState } from 'react';
import { UserAccount, Campaign, ServiceType } from '../types';
import { 
  PlusCircle, Play, Pause, Trash2, Eye, ThumbsUp, 
  UserPlus, MessageSquare, Clock, Globe, Zap, AlertCircle, 
  CheckCircle2, Sparkles, Sliders, ExternalLink, BarChart3, Users, Radio
} from 'lucide-react';

interface CampaignManagerProps {
  user: UserAccount;
  campaigns: Campaign[];
  onCreateCampaign: (newCampaign: Omit<Campaign, 'id' | 'deliveredAmount' | 'status' | 'createdAt'>) => boolean;
  onToggleCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  onOpenStore: () => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({
  user,
  campaigns,
  onCreateCampaign,
  onToggleCampaign,
  onDeleteCampaign,
  onOpenStore
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'manage'>('manage');
  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'active'>('all');
  
  // Form State
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('views');
  const [targetAmount, setTargetAmount] = useState(1000);
  const [durationSec, setDurationSec] = useState(60);
  const [speedPerHour, setSpeedPerHour] = useState(100);
  const [countryTarget, setCountryTarget] = useState('Worldwide');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Extract YouTube Video ID and Thumbnail
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const currentYtId = extractYouTubeId(videoUrl);
  const previewThumbnail = currentYtId 
    ? `https://img.youtube.com/vi/${currentYtId}/hqdefault.jpg`
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

  // Calculate Cost in Credits
  const calculateCost = () => {
    let basePerUnit = 1.5;
    if (serviceType === 'high_retention') basePerUnit = 2.5;
    if (serviceType === 'likes') basePerUnit = 5.0;
    if (serviceType === 'subscribers') basePerUnit = 20.0;
    if (serviceType === 'comments') basePerUnit = 15.0;
    if (serviceType === 'watch_time') basePerUnit = 10.0;

    // Scale with duration for views
    const durationFactor = (serviceType === 'views' || serviceType === 'high_retention') 
      ? Math.max(1, durationSec / 30) 
      : 1;

    return Math.round(targetAmount * basePerUnit * durationFactor);
  };

  const totalCost = calculateCost();
  const hasEnoughCredits = user.credits >= totalCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!videoUrl) {
      setErrorMsg('Please provide a valid YouTube video or channel URL.');
      return;
    }

    if (!hasEnoughCredits) {
      setErrorMsg(`Insufficient credits! You need ${totalCost.toLocaleString()} credits, but only have ${user.credits.toLocaleString()}.`);
      return;
    }

    const title = videoTitle || (currentYtId ? `YouTube Video #${currentYtId.slice(0, 6)}` : 'Organic YouTube Growth Campaign');
    const channel = channelName || user.username || 'Community Creator';

    const success = onCreateCampaign({
      videoUrl,
      videoTitle: title,
      channelName: channel,
      thumbnailUrl: previewThumbnail,
      serviceType,
      targetAmount,
      durationSec,
      speedPerHour,
      countryTarget,
      costCredits: totalCost
    });

    if (success) {
      setSuccessMsg('Campaign activated and synced to the cloud community pool!');
      setVideoUrl('');
      setVideoTitle('');
      setTimeout(() => {
        setSuccessMsg('');
        setActiveSubTab('manage');
        setFilterMode('all');
      }, 1200);
    }
  };

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((camp) => {
    if (filterMode === 'mine') return camp.userId === user.username;
    if (filterMode === 'active') return camp.status === 'active';
    return true;
  });

  const myCampaignsCount = campaigns.filter((c) => c.userId === user.username).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub tabs: Create vs Manage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">Campaign Hub</h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Cloud Pool
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real organic YouTube views, likes, and watch time synced in real time across the entire global creator network.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#121426] p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('manage')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition ${
              activeSubTab === 'manage'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Community Campaigns ({campaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('create')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition ${
              activeSubTab === 'create'
                ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ New Campaign</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CREATE NEW CAMPAIGN */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Campaign Form (2 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#13162a] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            {errorMsg && (
              <div className="bg-rose-950/50 border border-rose-800 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="flex-1 font-medium">{errorMsg}</span>
                {!hasEnoughCredits && (
                  <button
                    type="button"
                    onClick={onOpenStore}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shrink-0"
                  >
                    Top Up Credits
                  </button>
                )}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-950/50 border border-emerald-800 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Service Type Selection */}
            <div>
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block mb-2.5">
                1. Select Growth Service
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'views', name: 'YouTube Views', icon: Eye, desc: 'High retention organic traffic' },
                  { id: 'high_retention', name: 'High Watch Time', icon: Clock, desc: '90-300s algorithm booster' },
                  { id: 'likes', name: 'Organic Likes', icon: ThumbsUp, desc: 'Social proof & engagement' },
                  { id: 'subscribers', name: 'Subscribers', icon: UserPlus, desc: 'Real permanent channel fans' },
                  { id: 'comments', name: 'Custom Comments', icon: MessageSquare, desc: 'Contextual comment boosts' },
                  { id: 'watch_time', name: '4,000h Monetizer', icon: Sparkles, desc: 'YPP Partner program pacing' }
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServiceType(s.id as ServiceType)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                        serviceType === s.id
                          ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-600/20'
                          : 'bg-[#0f1122] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Icon className={`w-4 h-4 ${serviceType === s.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                        {serviceType === s.id && <span className="w-2 h-2 rounded-full bg-indigo-400"></span>}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{s.name}</span>
                        <span className="text-[10px] text-slate-400 block line-clamp-1">{s.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video URL & Details */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                2. YouTube Video or Channel Link
              </label>
              <div>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-[#0e1020] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Real-time YouTube Video Preview */}
              {currentYtId && (
                <div className="flex items-center gap-3 bg-[#0a0c18] p-3 rounded-2xl border border-indigo-500/30">
                  <img
                    src={previewThumbnail}
                    alt="YouTube Preview"
                    className="w-20 h-12 rounded-lg object-cover border border-slate-700"
                  />
                  <div className="text-xs truncate">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Valid YouTube Video ID: {currentYtId}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">Ready to broadcast to the community pool</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Video Title (e.g., My New Single Video)"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="bg-[#0e1020] border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Channel Name (e.g., Nexus Creator Studio)"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="bg-[#0e1020] border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Target Quantity & Duration Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0e1020] p-4 rounded-2xl border border-slate-800">
              {/* Target Quantity */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-300">Quantity (Units)</span>
                  <span className="text-xs font-mono font-black text-indigo-400">{targetAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>50</span>
                  <span>5,000</span>
                  <span>10,000+</span>
                </div>
              </div>

              {/* View Duration in Seconds */}
              {(serviceType === 'views' || serviceType === 'high_retention') && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-300">Watch Duration</span>
                    <span className="text-xs font-mono font-black text-purple-400">{durationSec} Seconds</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="10"
                    value={durationSec}
                    onChange={(e) => setDurationSec(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>30s (Fast)</span>
                    <span>150s</span>
                    <span>300s (Max Retention)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Pacing & Geo Targeting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Hourly Speed Pacing:</label>
                <select
                  value={speedPerHour}
                  onChange={(e) => setSpeedPerHour(Number(e.target.value))}
                  className="w-full bg-[#0e1020] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={50}>Natural Drip (50/hour - Recommended)</option>
                  <option value={150}>Standard Momentum (150/hour)</option>
                  <option value={500}>Turbo Fast (500/hour)</option>
                  <option value={1500}>Viral Surge (1,500/hour)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Geographic Audience:</label>
                <select
                  value={countryTarget}
                  onChange={(e) => setCountryTarget(e.target.value)}
                  className="w-full bg-[#0e1020] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Worldwide">Worldwide (Fastest Delivery)</option>
                  <option value="United States, UK, Canada">Tier-1 English (US, UK, CA, AU)</option>
                  <option value="Europe Tier-1">Europe Tier-1 (DE, FR, ES, IT)</option>
                  <option value="Latin America">Latin America & Spain</option>
                  <option value="Asia-Pacific">Asia-Pacific Region</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl font-black text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                hasEnoughCredits
                  ? 'bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white shadow-indigo-600/30 active:scale-98'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Launch Campaign ({totalCost.toLocaleString()} Credits)</span>
            </button>
          </form>

          {/* Right Summary Card (1 col) */}
          <div className="space-y-4">
            <div className="bg-[#14172c] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Cost Calculation
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Quantity:</span>
                  <span className="text-white font-bold font-mono">{targetAmount.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Type:</span>
                  <span className="text-indigo-400 font-bold uppercase">{serviceType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Your Current Balance:</span>
                  <span className="text-amber-300 font-bold font-mono">{user.credits.toLocaleString()} credits</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white">Campaign Total:</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{totalCost.toLocaleString()} ⚡</span>
                </div>
              </div>

              {!hasEnoughCredits && (
                <div className="bg-amber-950/40 border border-amber-800/40 p-3 rounded-xl text-xs text-amber-300 space-y-2">
                  <p>You need <strong>{(totalCost - user.credits).toLocaleString()} more credits</strong> to launch this campaign.</p>
                  <button
                    onClick={onOpenStore}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition"
                  >
                    Buy Credits with PayPal / BTC
                  </button>
                </div>
              )}
            </div>

            {/* Campaign Guarantee */}
            <div className="bg-[#14172c] border border-slate-800 rounded-3xl p-5 text-xs text-slate-300 space-y-2 shadow-lg">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                YTMonster Quality Promise
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All views and engagements originate from genuine creator accounts running our exchange engine. No automated bot proxies, ensuring 100% AdSense & YouTube Terms safety.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE ACTIVE CAMPAIGNS */}
      {activeSubTab === 'manage' && (
        <div className="space-y-4">
          {/* Sub filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#13162a] p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterMode === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800/50'
                }`}
              >
                🌐 Global Pool ({campaigns.length})
              </button>
              <button
                onClick={() => setFilterMode('mine')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterMode === 'mine'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800/50'
                }`}
              >
                👤 My Campaigns ({myCampaignsCount})
              </button>
              <button
                onClick={() => setFilterMode('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterMode === 'active'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800/50'
                }`}
              >
                ⚡ Live Running
              </button>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Real-time Cloud Sync Active</span>
            </div>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="bg-[#13162a] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Play className="w-6 h-6 ml-0.5" />
              </div>
              <h4 className="text-lg font-bold text-white">No Campaigns in this view</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Launch your YouTube video into the community pool and watch views delivered in real time!
              </p>
              <button
                onClick={() => setActiveSubTab('create')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
              >
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCampaigns.map((camp) => {
                const progress = Math.min(100, Math.round((camp.deliveredAmount / camp.targetAmount) * 100));
                const isMyCamp = camp.userId === user.username;

                return (
                  <div
                    key={camp.id}
                    className={`bg-[#13162a] border rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg transition ${
                      isMyCamp ? 'border-indigo-500/50 bg-[#161a34]' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-3.5 w-full md:w-auto">
                      <div className="relative shrink-0">
                        <img
                          src={camp.thumbnailUrl}
                          alt={camp.videoTitle}
                          className="w-24 h-16 rounded-xl object-cover border border-slate-800"
                        />
                        {isMyCamp && (
                          <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                            Mine
                          </span>
                        )}
                      </div>

                      <div className="truncate max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">
                            {camp.serviceType}
                          </span>
                          <span className="text-[10px] text-slate-400">{camp.createdAt}</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">
                            {camp.status === 'active' ? '● LIVE' : '⏸ PAUSED'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate mt-0.5">{camp.videoTitle}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{camp.channelName}</span>
                          <span>&bull;</span>
                          <span>{camp.speedPerHour}/hr</span>
                          {camp.videoUrl && (
                            <a
                              href={camp.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 text-[10px]"
                            >
                              <span>Watch URL</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Progress Bar */}
                    <div className="w-full md:w-64 space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Delivered</span>
                        <span className="text-white font-bold">
                          {camp.deliveredAmount.toLocaleString()} / {camp.targetAmount.toLocaleString()} ({progress}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <button
                        onClick={() => onToggleCampaign(camp.id)}
                        className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                          camp.status === 'active'
                            ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/50'
                            : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                        }`}
                        title={camp.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                      >
                        {camp.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-400" />}
                        <span>{camp.status === 'active' ? 'Pause' : 'Resume'}</span>
                      </button>

                      <button
                        onClick={() => onDeleteCampaign(camp.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-800 text-slate-400 hover:text-rose-300 transition"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

